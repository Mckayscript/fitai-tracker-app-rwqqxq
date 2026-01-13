
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';

const FITNESS_GOALS = [
  'Muscle Mass',
  'Weight Loss',
  'Endurance',
  'General Fitness',
  'Strength Training',
  'Flexibility',
];

const FITNESS_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced',
];

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Profile data
  const [name, setName] = useState('');
  const [age, setAge] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [fitnessLevel, setFitnessLevel] = useState('Intermediate');
  const [daysPerWeek, setDaysPerWeek] = useState('4');
  const [sessionDuration, setSessionDuration] = useState('60');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    console.log('Loading user profile');
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('No authenticated user found');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('get-user-profile');

      if (error) {
        console.error('Error loading profile:', error);
        setLoading(false);
        return;
      }

      if (data?.profile) {
        console.log('Profile loaded successfully');
        const profile = data.profile;
        setName(profile.name || '');
        setAge(profile.age?.toString() || '');
        setHeight(profile.height?.toString() || '');
        setWeight(profile.weight?.toString() || '');
        setFitnessGoal(profile.fitness_goal || '');
        setFitnessLevel(profile.fitness_level || 'Intermediate');
        setDaysPerWeek(profile.days_per_week?.toString() || '4');
        setSessionDuration(profile.session_duration?.toString() || '60');
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    console.log('User tapped Save Profile button');
    
    if (!fitnessGoal) {
      Alert.alert('Missing Information', 'Please select your fitness goal.');
      return;
    }

    setSaving(true);
    try {
      const { data, error } = await supabase.functions.invoke('save-user-profile', {
        body: {
          name,
          age: age ? parseInt(age) : null,
          height: height ? parseFloat(height) : null,
          weight: weight ? parseFloat(weight) : null,
          fitness_goal: fitnessGoal,
          fitness_level: fitnessLevel,
          days_per_week: parseInt(daysPerWeek),
          session_duration: parseInt(sessionDuration),
        },
      });

      if (error) throw error;

      console.log('Profile saved successfully');
      setIsEditing(false);
      Alert.alert('Success', 'Your fitness profile has been saved! Your workout plans will be personalized based on your goals.');
    } catch (error: any) {
      console.error('Failed to save profile:', error);
      Alert.alert('Error', error.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <IconSymbol 
              ios_icon_name="person.circle.fill" 
              android_material_icon_name="account-circle"
              size={80}
              color={colors.primary}
            />
          </View>
          <Text style={styles.name}>{name || 'Your Profile'}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => isEditing ? saveProfile() : setIsEditing(true)}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator size="small" color={colors.primary} />
            ) : (
              <>
                <IconSymbol 
                  ios_icon_name={isEditing ? "checkmark.circle.fill" : "pencil.circle.fill"}
                  android_material_icon_name={isEditing ? "check-circle" : "edit"}
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.editButtonText}>
                  {isEditing ? 'Save' : 'Edit Profile'}
                </Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* Personal Information */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.infoValue}>{name || 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Age</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="Age"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.infoValue}>{age ? `${age} years` : 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Height (cm)</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
                placeholder="Height"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.infoValue}>{height ? `${height} cm` : 'Not set'}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight (kg)</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
                placeholder="Weight"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.infoValue}>{weight ? `${weight} kg` : 'Not set'}</Text>
            )}
          </View>
        </View>

        {/* Fitness Goals */}
        <View style={[commonStyles.card, styles.goalCard]}>
          <View style={styles.goalHeader}>
            <IconSymbol 
              ios_icon_name="target" 
              android_material_icon_name="flag"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.cardTitle}>Fitness Goal</Text>
          </View>
          <Text style={styles.goalDescription}>
            Select your primary fitness goal to get personalized workout recommendations
          </Text>
          
          {isEditing ? (
            <View style={styles.goalsGrid}>
              {FITNESS_GOALS.map((goal) => (
                <TouchableOpacity
                  key={goal}
                  style={[
                    styles.goalOption,
                    fitnessGoal === goal && styles.goalOptionSelected,
                  ]}
                  onPress={() => {
                    console.log('User selected fitness goal:', goal);
                    setFitnessGoal(goal);
                  }}
                >
                  <Text
                    style={[
                      styles.goalOptionText,
                      fitnessGoal === goal && styles.goalOptionTextSelected,
                    ]}
                  >
                    {goal}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.selectedGoalContainer}>
              <Text style={styles.selectedGoalText}>
                {fitnessGoal || 'Not set - tap Edit to select'}
              </Text>
            </View>
          )}
        </View>

        {/* Fitness Level & Preferences */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Workout Preferences</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Fitness Level</Text>
            {isEditing ? (
              <View style={styles.levelButtons}>
                {FITNESS_LEVELS.map((level) => (
                  <TouchableOpacity
                    key={level}
                    style={[
                      styles.levelButton,
                      fitnessLevel === level && styles.levelButtonSelected,
                    ]}
                    onPress={() => setFitnessLevel(level)}
                  >
                    <Text
                      style={[
                        styles.levelButtonText,
                        fitnessLevel === level && styles.levelButtonTextSelected,
                      ]}
                    >
                      {level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : (
              <Text style={styles.infoValue}>{fitnessLevel}</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Days per Week</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={daysPerWeek}
                onChangeText={setDaysPerWeek}
                keyboardType="numeric"
                placeholder="4"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.infoValue}>{daysPerWeek} days</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Session Duration</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={sessionDuration}
                onChangeText={setSessionDuration}
                keyboardType="numeric"
                placeholder="60"
                placeholderTextColor={colors.textSecondary}
              />
            ) : (
              <Text style={styles.infoValue}>{sessionDuration} min</Text>
            )}
          </View>
        </View>

        {/* Subscription Status */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Subscription</Text>
          
          <View style={styles.subscriptionBadge}>
            <IconSymbol 
              ios_icon_name="star.circle.fill" 
              android_material_icon_name="stars"
              size={32}
              color={colors.highlight}
            />
            <View style={styles.subscriptionContent}>
              <Text style={styles.subscriptionTitle}>Free Plan</Text>
              <Text style={styles.subscriptionDescription}>
                Upgrade to Premium for AI-powered features
              </Text>
            </View>
          </View>

          <TouchableOpacity style={styles.upgradeButton}>
            <Text style={styles.upgradeButtonText}>Upgrade to Premium</Text>
            <IconSymbol 
              ios_icon_name="arrow.right" 
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.card}
            />
          </TouchableOpacity>
        </View>

        {/* Settings */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Settings</Text>
          
          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="bell.fill" 
              android_material_icon_name="notifications"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.settingText}>Notifications</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="moon.fill" 
              android_material_icon_name="dark-mode"
              size={24}
              color={colors.secondary}
            />
            <Text style={styles.settingText}>Dark Mode</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="questionmark.circle.fill" 
              android_material_icon_name="help"
              size={24}
              color={colors.success}
            />
            <Text style={styles.settingText}>Help & Support</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton}>
          <IconSymbol 
            ios_icon_name="arrow.right.square.fill" 
            android_material_icon_name="logout"
            size={20}
            color={colors.error}
          />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 100,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: colors.background,
    borderRadius: 20,
    minWidth: 120,
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    marginLeft: 6,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  infoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoInput: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    minWidth: 100,
    textAlign: 'right',
  },
  goalCard: {
    backgroundColor: colors.secondary,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalDescription: {
    fontSize: 14,
    color: colors.card,
    marginBottom: 16,
    lineHeight: 20,
  },
  goalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.card,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  goalOptionSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.highlight,
  },
  goalOptionText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  goalOptionTextSelected: {
    color: colors.card,
  },
  selectedGoalContainer: {
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  selectedGoalText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  levelButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  levelButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  levelButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  levelButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
  levelButtonTextSelected: {
    color: colors.card,
  },
  subscriptionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  subscriptionContent: {
    flex: 1,
    marginLeft: 16,
  },
  subscriptionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  subscriptionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  upgradeButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
  },
  upgradeButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 16,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 16,
    marginVertical: 24,
    paddingVertical: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 8,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginLeft: 8,
  },
});
