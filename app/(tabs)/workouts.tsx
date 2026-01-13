
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { WorkoutRoutineModal } from '@/components/WorkoutRoutineModal';
import { supabase } from '@/app/integrations/supabase/client';

interface Workout {
  id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  time: string;
}

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest: string;
  notes?: string;
  instructionImageUrl?: string;
}

interface DailyChecklist {
  id: string;
  date: string;
  day_name: string;
  exercises: Exercise[];
  completed: boolean;
  completed_exercises: string[];
  notes?: string;
}

const workoutTypes = [
  { name: 'Running', icon: 'directions-run', calories: 10 },
  { name: 'Cycling', icon: 'directions-bike', calories: 8 },
  { name: 'Swimming', icon: 'pool', calories: 9 },
  { name: 'Weightlifting', icon: 'fitness-center', calories: 6 },
  { name: 'Yoga', icon: 'self-improvement', calories: 4 },
  { name: 'Walking', icon: 'directions-walk', calories: 5 },
];

const fitnessGoals = [
  { name: 'Muscle Mass', icon: 'fitness-center', description: 'Build strength and size' },
  { name: 'Weight Loss', icon: 'local-fire-department', description: 'Burn fat and calories' },
  { name: 'Endurance', icon: 'directions-run', description: 'Improve stamina' },
  { name: 'General Fitness', icon: 'favorite', description: 'Overall health' },
];

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [duration, setDuration] = useState('');
  const [showRoutineModal, setShowRoutineModal] = useState(false);
  const [generatingRoutine, setGeneratingRoutine] = useState(false);
  const [generatedRoutine, setGeneratedRoutine] = useState<any>(null);
  
  // Daily checklist state
  const [dailyChecklist, setDailyChecklist] = useState<DailyChecklist | null>(null);
  const [loadingChecklist, setLoadingChecklist] = useState(true);
  const [completedExercises, setCompletedExercises] = useState<string[]>([]);

  useEffect(() => {
    loadDailyChecklist();
  }, []);

  const loadDailyChecklist = async () => {
    console.log('Loading daily workout checklist');
    try {
      const today = new Date().toISOString().split('T')[0];
      
      // Get project URL
      const { data: { project_url } } = await supabase.functions.getProjectUrl();
      
      // Call Edge Function with date as query parameter
      const response = await fetch(`${project_url}/functions/v1/get-daily-checklist?date=${today}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error loading checklist:', errorText);
        setLoadingChecklist(false);
        return;
      }

      const data = await response.json();

      if (data?.checklist) {
        console.log('Daily checklist loaded:', data.checklist);
        setDailyChecklist(data.checklist);
        setCompletedExercises(data.checklist.completed_exercises || []);
      } else {
        console.log('No workout scheduled for today');
      }
    } catch (error) {
      console.error('Failed to load checklist:', error);
    } finally {
      setLoadingChecklist(false);
    }
  };

  const toggleExerciseComplete = async (exerciseName: string) => {
    console.log('User toggled exercise completion:', exerciseName);
    
    if (!dailyChecklist) return;

    const newCompleted = completedExercises.includes(exerciseName)
      ? completedExercises.filter(e => e !== exerciseName)
      : [...completedExercises, exerciseName];

    setCompletedExercises(newCompleted);

    const allCompleted = newCompleted.length === dailyChecklist.exercises.length;

    try {
      const { data, error } = await supabase.functions.invoke('update-checklist', {
        body: {
          checklistId: dailyChecklist.id,
          completedExercises: newCompleted,
          completed: allCompleted,
        },
      });

      if (error) throw error;

      console.log('Checklist updated successfully');
      
      if (allCompleted) {
        Alert.alert('🎉 Workout Complete!', 'Great job finishing today\'s workout!');
      }
    } catch (error: any) {
      console.error('Failed to update checklist:', error);
      Alert.alert('Error', 'Failed to update checklist. Please try again.');
      // Revert on error
      setCompletedExercises(completedExercises);
    }
  };

  const addWorkout = () => {
    console.log('User tapped Log Workout button');
    if (!selectedType || !duration) {
      Alert.alert('Missing Information', 'Please select workout type and duration.');
      return;
    }

    const workoutType = workoutTypes.find(w => w.name === selectedType);
    const durationNum = parseInt(duration);
    const caloriesBurned = workoutType ? workoutType.calories * durationNum : 0;

    const newWorkout: Workout = {
      id: Date.now().toString(),
      type: selectedType,
      duration: durationNum,
      caloriesBurned,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    console.log('Logging workout:', newWorkout);
    setWorkouts([newWorkout, ...workouts]);
    setSelectedType('');
    setDuration('');
    setShowManualEntry(false);
    Alert.alert('Success', 'Workout logged successfully!');
  };

  const handleGenerateRoutine = async (goal: string) => {
    console.log('User tapped Generate Routine for goal:', goal);
    setGeneratingRoutine(true);
    setShowRoutineModal(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('generate-workout-with-images', {
        body: {
          goal,
          fitnessLevel: 'Intermediate',
          daysPerWeek: 4,
          sessionDuration: 60,
        },
      });

      if (error) {
        console.error('Error from Edge Function:', error);
        throw new Error(error.message || 'Failed to generate workout routine');
      }

      console.log('Workout routine generated with images');
      setGeneratedRoutine(data);
      
      // Reload checklist to show new workout plan
      await loadDailyChecklist();
      
      Alert.alert(
        'Success!',
        'Your personalized workout plan has been created with instruction images! Check your daily checklist below.',
        [{ text: 'OK' }]
      );
    } catch (error: any) {
      console.error('Failed to generate routine:', error);
      Alert.alert(
        'Error', 
        error.message || 'Failed to generate workout routine. Please check your internet connection and try again.'
      );
      setShowRoutineModal(false);
    } finally {
      setGeneratingRoutine(false);
    }
  };

  const totalDuration = workouts.reduce((sum, workout) => sum + workout.duration, 0);
  const totalCalories = workouts.reduce((sum, workout) => sum + workout.caloriesBurned, 0);

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Workout Tracker</Text>
          <Text style={styles.subtitle}>AI-powered personalized routines</Text>
        </View>

        {/* Daily Checklist */}
        {loadingChecklist ? (
          <View style={commonStyles.card}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading today&apos;s workout...</Text>
          </View>
        ) : dailyChecklist ? (
          <View style={[commonStyles.card, styles.checklistCard]}>
            <View style={styles.checklistHeader}>
              <IconSymbol 
                ios_icon_name="checkmark.circle.fill" 
                android_material_icon_name="check-circle"
                size={28}
                color={colors.success}
              />
              <Text style={styles.cardTitle}>Today&apos;s Workout</Text>
            </View>
            <Text style={styles.checklistDay}>{dailyChecklist.day_name}</Text>
            
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill,
                  { width: `${(completedExercises.length / dailyChecklist.exercises.length) * 100}%` }
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {completedExercises.length} of {dailyChecklist.exercises.length} exercises completed
            </Text>

            {dailyChecklist.exercises.map((exercise, index) => {
              const isCompleted = completedExercises.includes(exercise.name);
              return (
                <View key={index} style={styles.exerciseCheckItem}>
                  <TouchableOpacity
                    style={styles.exerciseCheckRow}
                    onPress={() => toggleExerciseComplete(exercise.name)}
                  >
                    <View style={[styles.checkbox, isCompleted && styles.checkboxChecked]}>
                      {isCompleted && (
                        <IconSymbol 
                          ios_icon_name="checkmark" 
                          android_material_icon_name="check"
                          size={16}
                          color={colors.card}
                        />
                      )}
                    </View>
                    <View style={styles.exerciseCheckInfo}>
                      <Text style={[styles.exerciseCheckName, isCompleted && styles.exerciseCheckNameCompleted]}>
                        {exercise.name}
                      </Text>
                      <Text style={styles.exerciseCheckDetails}>
                        {exercise.sets} sets × {exercise.reps} • Rest: {exercise.rest}
                      </Text>
                      {exercise.notes && (
                        <Text style={styles.exerciseCheckNotes}>💡 {exercise.notes}</Text>
                      )}
                    </View>
                  </TouchableOpacity>
                  
                  {exercise.instructionImageUrl && (
                    <Image
                      source={{ uri: exercise.instructionImageUrl }}
                      style={styles.instructionImage}
                      resizeMode="cover"
                    />
                  )}
                </View>
              );
            })}
          </View>
        ) : (
          <View style={[commonStyles.card, styles.noChecklistCard]}>
            <IconSymbol 
              ios_icon_name="calendar" 
              android_material_icon_name="calendar-today"
              size={48}
              color={colors.textSecondary}
            />
            <Text style={styles.noChecklistText}>No workout scheduled for today</Text>
            <Text style={styles.noChecklistSubtext}>
              Generate a personalized routine below to get started!
            </Text>
          </View>
        )}

        {/* Daily Summary */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Today&apos;s Activity</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <IconSymbol 
                ios_icon_name="flame.fill" 
                android_material_icon_name="local-fire-department"
                size={32}
                color={colors.accent}
              />
              <Text style={styles.summaryValue}>{totalCalories}</Text>
              <Text style={styles.summaryLabel}>Calories Burned</Text>
            </View>
            <View style={styles.summaryItem}>
              <IconSymbol 
                ios_icon_name="clock.fill" 
                android_material_icon_name="schedule"
                size={32}
                color={colors.primary}
              />
              <Text style={styles.summaryValue}>{totalDuration}</Text>
              <Text style={styles.summaryLabel}>Minutes</Text>
            </View>
            <View style={styles.summaryItem}>
              <IconSymbol 
                ios_icon_name="figure.run" 
                android_material_icon_name="fitness-center"
                size={32}
                color={colors.success}
              />
              <Text style={styles.summaryValue}>{workouts.length}</Text>
              <Text style={styles.summaryLabel}>Workouts</Text>
            </View>
          </View>
        </View>

        {/* AI Workout Routines */}
        <View style={[commonStyles.card, styles.aiCard]}>
          <View style={styles.aiHeader}>
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto-awesome"
              size={28}
              color={colors.highlight}
            />
            <Text style={styles.cardTitle}>AI Workout Routines</Text>
          </View>
          <Text style={styles.aiDescription}>
            Get a personalized workout plan with instruction images based on your fitness goals
          </Text>
          
          <View style={styles.goalsGrid}>
            {fitnessGoals.map((goal) => (
              <TouchableOpacity
                key={goal.name}
                style={styles.goalCard}
                onPress={() => handleGenerateRoutine(goal.name)}
                disabled={generatingRoutine}
              >
                <IconSymbol 
                  ios_icon_name="figure.run" 
                  android_material_icon_name={goal.icon as any}
                  size={32}
                  color={colors.primary}
                />
                <Text style={styles.goalName}>{goal.name}</Text>
                <Text style={styles.goalDescription}>{goal.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quick Add Workouts */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Quick Add Workout</Text>
          <View style={styles.workoutGrid}>
            {workoutTypes.map((workout) => (
              <TouchableOpacity
                key={workout.name}
                style={styles.workoutTypeButton}
                onPress={() => {
                  console.log('User selected workout type:', workout.name);
                  setSelectedType(workout.name);
                  setShowManualEntry(true);
                }}
              >
                <IconSymbol 
                  ios_icon_name="figure.run" 
                  android_material_icon_name={workout.icon as any}
                  size={32}
                  color={colors.primary}
                />
                <Text style={styles.workoutTypeName}>{workout.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Manual Entry Form */}
        {showManualEntry && (
          <View style={commonStyles.card}>
            <Text style={styles.cardTitle}>Log Workout Details</Text>
            
            <Text style={styles.label}>Workout Type</Text>
            <View style={styles.selectedWorkout}>
              <Text style={styles.selectedWorkoutText}>{selectedType}</Text>
              <TouchableOpacity onPress={() => setShowManualEntry(false)}>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Duration (minutes)</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter duration"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={duration}
              onChangeText={setDuration}
            />

            <TouchableOpacity style={styles.addButton} onPress={addWorkout}>
              <Text style={styles.addButtonText}>Log Workout</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Workouts List */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Today&apos;s Workouts</Text>
          
          {workouts.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol 
                ios_icon_name="figure.run" 
                android_material_icon_name="fitness-center"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No workouts logged yet</Text>
              <Text style={styles.emptySubtext}>Start by logging your first workout!</Text>
            </View>
          ) : (
            workouts.map((workout) => (
              <View key={workout.id} style={styles.workoutItem}>
                <View style={styles.workoutHeader}>
                  <Text style={styles.workoutType}>{workout.type}</Text>
                  <Text style={styles.workoutTime}>{workout.time}</Text>
                </View>
                <View style={styles.workoutDetails}>
                  <View style={styles.workoutDetail}>
                    <IconSymbol 
                      ios_icon_name="clock" 
                      android_material_icon_name="schedule"
                      size={16}
                      color={colors.textSecondary}
                    />
                    <Text style={styles.workoutDetailText}>{workout.duration} min</Text>
                  </View>
                  <View style={styles.workoutDetail}>
                    <IconSymbol 
                      ios_icon_name="flame" 
                      android_material_icon_name="local-fire-department"
                      size={16}
                      color={colors.accent}
                    />
                    <Text style={styles.workoutDetailText}>{workout.caloriesBurned} cal</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Workout Routine Modal */}
      <WorkoutRoutineModal
        visible={showRoutineModal}
        routine={generatedRoutine?.routine || null}
        loading={generatingRoutine}
        onClose={() => setShowRoutineModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  checklistCard: {
    backgroundColor: colors.secondary,
  },
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  checklistDay: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.card,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.success,
  },
  progressText: {
    fontSize: 14,
    color: colors.card,
    marginBottom: 16,
  },
  exerciseCheckItem: {
    marginBottom: 16,
  },
  exerciseCheckRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.success,
    borderColor: colors.success,
  },
  exerciseCheckInfo: {
    flex: 1,
  },
  exerciseCheckName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
    marginBottom: 4,
  },
  exerciseCheckNameCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.7,
  },
  exerciseCheckDetails: {
    fontSize: 14,
    color: colors.card,
    opacity: 0.8,
  },
  exerciseCheckNotes: {
    fontSize: 13,
    color: colors.highlight,
    marginTop: 4,
    fontStyle: 'italic',
  },
  instructionImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginTop: 12,
    backgroundColor: colors.background,
  },
  noChecklistCard: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  noChecklistText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  noChecklistSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  aiCard: {
    backgroundColor: colors.secondary,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: colors.card,
    marginBottom: 16,
    lineHeight: 20,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  goalCard: {
    width: '48%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  goalName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  goalDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  workoutGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  workoutTypeButton: {
    width: '48%',
    backgroundColor: colors.background,
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  workoutTypeName: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  selectedWorkout: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  selectedWorkoutText: {
    fontSize: 16,
    color: colors.text,
  },
  changeText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.text,
    marginBottom: 16,
  },
  addButton: {
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  addButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  workoutItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  workoutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  workoutType: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  workoutTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  workoutDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  workoutDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  workoutDetailText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 4,
  },
});
