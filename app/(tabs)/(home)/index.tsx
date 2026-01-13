
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();

  console.log('HomeScreen rendered');

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome to FitAI Tracker</Text>
          <Text style={styles.subGreeting}>Track your fitness journey with AI</Text>
        </View>

        {/* Daily Summary Card */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Today&apos;s Summary</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="flame.fill" 
                android_material_icon_name="local-fire-department"
                size={32}
                color={colors.accent}
              />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>

            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="figure.walk" 
                android_material_icon_name="directions-walk"
                size={32}
                color={colors.primary}
              />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Workouts</Text>
            </View>

            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="chart.line.uptrend.xyaxis" 
                android_material_icon_name="trending-up"
                size={32}
                color={colors.success}
              />
              <Text style={styles.statValue}>0</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>

        {/* Macros Card */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Macros Today</Text>
          
          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>Protein</Text>
              <Text style={styles.macroValue}>0g / 150g</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%', backgroundColor: colors.accent }]} />
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>Carbs</Text>
              <Text style={styles.macroValue}>0g / 200g</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%', backgroundColor: colors.primary }]} />
            </View>
          </View>

          <View style={styles.macroItem}>
            <View style={styles.macroHeader}>
              <Text style={styles.macroLabel}>Fat</Text>
              <Text style={styles.macroValue}>0g / 65g</Text>
            </View>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: '0%', backgroundColor: colors.highlight }]} />
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              console.log('User tapped Log Meal with Photo');
              router.push('/(tabs)/meals');
            }}
          >
            <IconSymbol 
              ios_icon_name="camera.fill" 
              android_material_icon_name="camera-alt"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.actionText}>Log Meal with Photo</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              console.log('User tapped Log Workout');
              router.push('/(tabs)/workouts');
            }}
          >
            <IconSymbol 
              ios_icon_name="figure.run" 
              android_material_icon_name="directions-run"
              size={24}
              color={colors.secondary}
            />
            <Text style={styles.actionText}>Log Workout</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              console.log('User tapped View Progress');
              router.push('/(tabs)/progress');
            }}
          >
            <IconSymbol 
              ios_icon_name="chart.bar.fill" 
              android_material_icon_name="bar-chart"
              size={24}
              color={colors.success}
            />
            <Text style={styles.actionText}>View Progress</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => {
              console.log('User tapped AI Content Generator');
              router.push('/(tabs)/content-generator');
            }}
          >
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto-awesome"
              size={24}
              color={colors.highlight}
            />
            <Text style={styles.actionText}>AI Content Generator</Text>
            <IconSymbol 
              ios_icon_name="chevron.right" 
              android_material_icon_name="chevron-right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* AI Insights Card */}
        <View style={[commonStyles.card, styles.insightsCard]}>
          <View style={styles.insightsHeader}>
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto-awesome"
              size={24}
              color={colors.highlight}
            />
            <Text style={styles.cardTitle}>AI Insights</Text>
          </View>
          <Text style={styles.insightText}>
            Start logging your meals and workouts to get personalized AI insights and recommendations!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingTop: 48,
    paddingBottom: 140,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
  },
  macroItem: {
    marginBottom: 16,
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  macroLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
  },
  macroValue: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.background,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  actionText: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    marginLeft: 12,
  },
  insightsCard: {
    backgroundColor: colors.secondary,
  },
  insightsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightText: {
    fontSize: 14,
    color: colors.card,
    lineHeight: 20,
  },
});
