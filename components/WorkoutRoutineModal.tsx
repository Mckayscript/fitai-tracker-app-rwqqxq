
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import type { WorkoutRoutine } from '@/hooks/useWorkoutGeneration';

interface WorkoutRoutineModalProps {
  visible: boolean;
  routine: WorkoutRoutine | null;
  loading: boolean;
  onClose: () => void;
}

export function WorkoutRoutineModal({
  visible,
  routine,
  loading,
  onClose,
}: WorkoutRoutineModalProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  const toggleDay = (index: number) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Your AI Workout Plan</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <IconSymbol
                ios_icon_name="xmark.circle.fill"
                android_material_icon_name="cancel"
                size={28}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={colors.primary} />
              <Text style={styles.loadingText}>
                Generating your personalized workout routine...
              </Text>
            </View>
          ) : routine ? (
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Overview */}
              <View style={styles.overviewCard}>
                <Text style={styles.goalText}>{routine.goal}</Text>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <IconSymbol
                      ios_icon_name="calendar"
                      android_material_icon_name="calendar-today"
                      size={24}
                      color={colors.primary}
                    />
                    <Text style={styles.statValue}>{routine.daysPerWeek}</Text>
                    <Text style={styles.statLabel}>Days/Week</Text>
                  </View>
                  <View style={styles.statItem}>
                    <IconSymbol
                      ios_icon_name="clock"
                      android_material_icon_name="schedule"
                      size={24}
                      color={colors.accent}
                    />
                    <Text style={styles.statValue}>{routine.sessionDuration}</Text>
                    <Text style={styles.statLabel}>Minutes</Text>
                  </View>
                </View>
              </View>

              {/* Weekly Schedule */}
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Weekly Schedule</Text>
                {routine.weeklySchedule.map((day, index) => (
                  <React.Fragment key={index}>
                    <TouchableOpacity
                      style={styles.dayCard}
                      onPress={() => toggleDay(index)}
                    >
                      <View style={styles.dayHeader}>
                        <View style={styles.dayInfo}>
                          <Text style={styles.dayName}>{day.day}</Text>
                          <Text style={styles.dayFocus}>{day.focus}</Text>
                        </View>
                        <IconSymbol
                          ios_icon_name={
                            expandedDay === index
                              ? 'chevron.up'
                              : 'chevron.down'
                          }
                          android_material_icon_name={
                            expandedDay === index
                              ? 'keyboard-arrow-up'
                              : 'keyboard-arrow-down'
                          }
                          size={24}
                          color={colors.primary}
                        />
                      </View>

                      {expandedDay === index && (
                        <View style={styles.exercisesList}>
                          {day.exercises.map((exercise, exIndex) => (
                            <View key={exIndex} style={styles.exerciseItem}>
                              <Text style={styles.exerciseName}>
                                {exercise.name}
                              </Text>
                              <View style={styles.exerciseDetails}>
                                <Text style={styles.exerciseDetail}>
                                  {exercise.sets} sets × {exercise.reps}
                                </Text>
                                <Text style={styles.exerciseDetail}>
                                  Rest: {exercise.rest}
                                </Text>
                              </View>
                              {exercise.notes && (
                                <Text style={styles.exerciseNotes}>
                                  💡 {exercise.notes}
                                </Text>
                              )}
                            </View>
                          ))}
                        </View>
                      )}
                    </TouchableOpacity>
                  </React.Fragment>
                ))}
              </View>

              {/* Tips */}
              {routine.tips && routine.tips.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Training Tips</Text>
                  <View style={styles.tipsCard}>
                    {routine.tips.map((tip, index) => (
                      <View key={index} style={styles.tipItem}>
                        <IconSymbol
                          ios_icon_name="checkmark.circle.fill"
                          android_material_icon_name="check-circle"
                          size={20}
                          color={colors.success}
                        />
                        <Text style={styles.tipText}>{tip}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {/* Progression Plan */}
              {routine.progressionPlan && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Progression Plan</Text>
                  <View style={styles.progressionCard}>
                    <IconSymbol
                      ios_icon_name="chart.line.uptrend.xyaxis"
                      android_material_icon_name="trending-up"
                      size={24}
                      color={colors.highlight}
                    />
                    <Text style={styles.progressionText}>
                      {routine.progressionPlan}
                    </Text>
                  </View>
                </View>
              )}

              <View style={styles.bottomPadding} />
            </ScrollView>
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No routine generated yet</Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingTop: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  overviewCard: {
    margin: 16,
    padding: 20,
    backgroundColor: colors.background,
    borderRadius: 12,
  },
  goalText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  dayCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayInfo: {
    flex: 1,
  },
  dayName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  dayFocus: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '500',
  },
  exercisesList: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  exerciseItem: {
    marginBottom: 16,
  },
  exerciseName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  exerciseDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  exerciseDetail: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  exerciseNotes: {
    fontSize: 13,
    color: colors.accent,
    marginTop: 6,
    fontStyle: 'italic',
  },
  tipsCard: {
    backgroundColor: colors.background,
    borderRadius: 12,
    padding: 16,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    marginLeft: 12,
    lineHeight: 20,
  },
  progressionCard: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  progressionText: {
    flex: 1,
    fontSize: 14,
    color: colors.card,
    marginLeft: 12,
    lineHeight: 20,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  bottomPadding: {
    height: 40,
  },
});
