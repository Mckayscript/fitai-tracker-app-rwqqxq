
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { LineChart, BarChart } from 'react-native-chart-kit';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;

export default function ProgressScreen() {
  // Sample data - in a real app, this would come from your database
  const weightData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [75, 74.8, 74.5, 74.7, 74.3, 74.1, 74],
    }],
  };

  const caloriesData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      data: [1800, 2100, 1950, 2200, 1900, 2300, 2000],
    }],
  };

  const chartConfig = {
    backgroundColor: colors.card,
    backgroundGradientFrom: colors.card,
    backgroundGradientTo: colors.card,
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(41, 171, 226, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(33, 33, 33, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  // Doughnut chart for daily calorie goal
  const DoughnutChart = ({ percentage, label, value, total }: { percentage: number; label: string; value: number; total: number }) => {
    const size = 120;
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <View style={styles.doughnutContainer}>
        <Svg width={size} height={size}>
          <Circle
            stroke={colors.background}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
          />
          <Circle
            stroke={colors.primary}
            fill="none"
            cx={size / 2}
            cy={size / 2}
            r={radius}
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
          <SvgText
            x={size / 2}
            y={size / 2 - 10}
            textAnchor="middle"
            fontSize="20"
            fontWeight="700"
            fill={colors.text}
          >
            {percentage}%
          </SvgText>
          <SvgText
            x={size / 2}
            y={size / 2 + 15}
            textAnchor="middle"
            fontSize="12"
            fill={colors.textSecondary}
          >
            {value}/{total}
          </SvgText>
        </Svg>
        <Text style={styles.doughnutLabel}>{label}</Text>
      </View>
    );
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Progress Tracker</Text>
          <Text style={styles.subtitle}>Visualize your fitness journey</Text>
        </View>

        {/* Daily Goals */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Today&apos;s Goals</Text>
          <View style={styles.goalsRow}>
            <DoughnutChart percentage={0} label="Calories" value={0} total={2000} />
            <DoughnutChart percentage={0} label="Protein" value={0} total={150} />
            <DoughnutChart percentage={0} label="Workouts" value={0} total={1} />
          </View>
        </View>

        {/* Weight Progress */}
        <View style={commonStyles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Weight Progress</Text>
            <View style={styles.badge}>
              <IconSymbol 
                ios_icon_name="arrow.down" 
                android_material_icon_name="trending-down"
                size={16}
                color={colors.success}
              />
              <Text style={styles.badgeText}>-1.0 kg</Text>
            </View>
          </View>
          <LineChart
            data={weightData}
            width={screenWidth - 64}
            height={200}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
          />
          <Text style={styles.chartCaption}>Last 7 days</Text>
        </View>

        {/* Calorie Intake */}
        <View style={commonStyles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Calorie Intake</Text>
            <Text style={styles.averageText}>Avg: 2,036 cal</Text>
          </View>
          <BarChart
            data={caloriesData}
            width={screenWidth - 64}
            height={200}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(255, 64, 129, ${opacity})`,
            }}
            style={styles.chart}
            yAxisSuffix=""
            showValuesOnTopOfBars
          />
          <Text style={styles.chartCaption}>Last 7 days</Text>
        </View>

        {/* Stats Summary */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Weekly Summary</Text>
          
          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="flame.fill" 
                android_material_icon_name="local-fire-department"
                size={24}
                color={colors.accent}
              />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>14,252</Text>
                <Text style={styles.statLabel}>Total Calories</Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="figure.run" 
                android_material_icon_name="fitness-center"
                size={24}
                color={colors.primary}
              />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>5</Text>
                <Text style={styles.statLabel}>Workouts Completed</Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="clock.fill" 
                android_material_icon_name="schedule"
                size={24}
                color={colors.secondary}
              />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>180</Text>
                <Text style={styles.statLabel}>Active Minutes</Text>
              </View>
            </View>
          </View>

          <View style={styles.statRow}>
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="chart.line.uptrend.xyaxis" 
                android_material_icon_name="trending-up"
                size={24}
                color={colors.success}
              />
              <View style={styles.statContent}>
                <Text style={styles.statValue}>7</Text>
                <Text style={styles.statLabel}>Day Streak</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Achievements */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Recent Achievements</Text>
          
          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <IconSymbol 
                ios_icon_name="star.fill" 
                android_material_icon_name="star"
                size={24}
                color={colors.highlight}
              />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>First Workout</Text>
              <Text style={styles.achievementDescription}>Completed your first workout session</Text>
            </View>
          </View>

          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <IconSymbol 
                ios_icon_name="flame.fill" 
                android_material_icon_name="local-fire-department"
                size={24}
                color={colors.accent}
              />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>7 Day Streak</Text>
              <Text style={styles.achievementDescription}>Logged meals for 7 consecutive days</Text>
            </View>
          </View>

          <View style={styles.achievementItem}>
            <View style={styles.achievementIcon}>
              <IconSymbol 
                ios_icon_name="trophy.fill" 
                android_material_icon_name="emoji-events"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Goal Crusher</Text>
              <Text style={styles.achievementDescription}>Met your calorie goal 5 times this week</Text>
            </View>
          </View>
        </View>

        {/* AI Insights */}
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
            • You&apos;re consistently meeting your protein goals - great job!
          </Text>
          <Text style={styles.insightText}>
            • Your calorie intake is 150 calories over target on weekends
          </Text>
          <Text style={styles.insightText}>
            • Consider adding 2 more strength training sessions per week
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
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.success,
    marginLeft: 4,
  },
  averageText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 8,
  },
  chartCaption: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
  },
  goalsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  doughnutContainer: {
    alignItems: 'center',
  },
  doughnutLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
  },
  statRow: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statContent: {
    marginLeft: 16,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  achievementIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  achievementContent: {
    flex: 1,
    marginLeft: 16,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
    color: colors.textSecondary,
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
    lineHeight: 24,
    marginBottom: 8,
  },
});
