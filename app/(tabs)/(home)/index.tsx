
import { colors, commonStyles } from '@/styles/commonStyles';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import React from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  greeting: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  statsContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  quickActions: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  actionButton: {
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    padding: 20,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  actionIcon: {
    marginRight: 16,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  testingButton: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testingButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
});

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 100 }}>
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome to FitAI</Text>
        <Text style={styles.subtitle}>Track your fitness journey with AI</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>1,850</Text>
          <Text style={styles.statLabel}>Calories Today</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>3/5</Text>
          <Text style={styles.statLabel}>Workouts</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>7</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
      </View>

      {/* Testing Guide Button */}
      <TouchableOpacity 
        style={styles.testingButton}
        onPress={() => router.push('/(tabs)/testing-guide')}
      >
        <IconSymbol 
          ios_icon_name="info.circle.fill" 
          android_material_icon_name="info" 
          size={24} 
          color="#FFFFFF" 
        />
        <Text style={styles.testingButtonText}>How to Test Your App Fully</Text>
      </TouchableOpacity>

      <View style={styles.quickActions}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/meals')}
        >
          <View style={styles.actionIcon}>
            <IconSymbol 
              ios_icon_name="camera.fill" 
              android_material_icon_name="camera" 
              size={32} 
              color={colors.primary} 
            />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Log Meal</Text>
            <Text style={styles.actionDescription}>Take a photo or enter manually</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/workouts')}
        >
          <View style={styles.actionIcon}>
            <IconSymbol 
              ios_icon_name="figure.run" 
              android_material_icon_name="fitness-center" 
              size={32} 
              color={colors.primary} 
            />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Start Workout</Text>
            <Text style={styles.actionDescription}>Follow your AI-generated routine</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/progress')}
        >
          <View style={styles.actionIcon}>
            <IconSymbol 
              ios_icon_name="chart.bar.fill" 
              android_material_icon_name="show-chart" 
              size={32} 
              color={colors.primary} 
            />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>View Progress</Text>
            <Text style={styles.actionDescription}>Track your fitness journey</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.actionButton}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <View style={styles.actionIcon}>
            <IconSymbol 
              ios_icon_name="person.fill" 
              android_material_icon_name="person" 
              size={32} 
              color={colors.primary} 
            />
          </View>
          <View style={styles.actionText}>
            <Text style={styles.actionTitle}>Update Profile</Text>
            <Text style={styles.actionDescription}>Set your fitness goals</Text>
          </View>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
