
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface Workout {
  id: string;
  type: string;
  duration: number;
  caloriesBurned: number;
  time: string;
}

const workoutTypes = [
  { name: 'Running', icon: 'directions-run', calories: 10 },
  { name: 'Cycling', icon: 'directions-bike', calories: 8 },
  { name: 'Swimming', icon: 'pool', calories: 9 },
  { name: 'Weightlifting', icon: 'fitness-center', calories: 6 },
  { name: 'Yoga', icon: 'self-improvement', calories: 4 },
  { name: 'Walking', icon: 'directions-walk', calories: 5 },
];

export default function WorkoutsScreen() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [selectedType, setSelectedType] = useState('');
  const [duration, setDuration] = useState('');

  const addWorkout = () => {
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

    setWorkouts([newWorkout, ...workouts]);
    setSelectedType('');
    setDuration('');
    setShowManualEntry(false);
    Alert.alert('Success', 'Workout logged successfully!');
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
          <Text style={styles.subtitle}>Log your workouts and track progress</Text>
        </View>

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

        {/* Quick Add Workouts */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Quick Add Workout</Text>
          <View style={styles.workoutGrid}>
            {workoutTypes.map((workout) => (
              <TouchableOpacity
                key={workout.name}
                style={styles.workoutTypeButton}
                onPress={() => {
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

        {/* AI Recommendations */}
        <View style={[commonStyles.card, styles.aiCard]}>
          <View style={styles.aiHeader}>
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto-awesome"
              size={24}
              color={colors.highlight}
            />
            <Text style={styles.cardTitle}>AI Workout Recommendations</Text>
          </View>
          <Text style={styles.aiText}>
            Keep logging your workouts to get personalized AI recommendations based on your fitness goals and progress!
          </Text>
        </View>
      </ScrollView>
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
  aiCard: {
    backgroundColor: colors.secondary,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  aiText: {
    fontSize: 14,
    color: colors.card,
    lineHeight: 20,
  },
});
