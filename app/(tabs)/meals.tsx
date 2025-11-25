
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import * as ImagePicker from 'expo-image-picker';

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
}

export default function MealsScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos of your meals.');
      return false;
    }
    return true;
  };

  const takeMealPhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      Alert.alert(
        'AI Feature',
        'AI food recognition is a premium feature. This will analyze your photo and estimate calories and macros. For now, please use manual entry.',
        [{ text: 'OK' }]
      );
    }
  };

  const pickMealPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      Alert.alert(
        'AI Feature',
        'AI food recognition is a premium feature. This will analyze your photo and estimate calories and macros. For now, please use manual entry.',
        [{ text: 'OK' }]
      );
    }
  };

  const addManualMeal = () => {
    if (!mealName || !calories) {
      Alert.alert('Missing Information', 'Please enter at least meal name and calories.');
      return;
    }

    const newMeal: Meal = {
      id: Date.now().toString(),
      name: mealName,
      calories: parseInt(calories) || 0,
      protein: parseInt(protein) || 0,
      carbs: parseInt(carbs) || 0,
      fat: parseInt(fat) || 0,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    };

    setMeals([newMeal, ...meals]);
    setMealName('');
    setCalories('');
    setProtein('');
    setCarbs('');
    setFat('');
    setShowManualEntry(false);
    Alert.alert('Success', 'Meal logged successfully!');
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const totalProtein = meals.reduce((sum, meal) => sum + meal.protein, 0);
  const totalCarbs = meals.reduce((sum, meal) => sum + meal.carbs, 0);
  const totalFat = meals.reduce((sum, meal) => sum + meal.fat, 0);

  return (
    <View style={commonStyles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Meal Tracker</Text>
          <Text style={styles.subtitle}>Log your meals and track nutrition</Text>
        </View>

        {/* Daily Summary */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Today&apos;s Nutrition</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalCalories}</Text>
              <Text style={styles.summaryLabel}>Calories</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalProtein}g</Text>
              <Text style={styles.summaryLabel}>Protein</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalCarbs}g</Text>
              <Text style={styles.summaryLabel}>Carbs</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalFat}g</Text>
              <Text style={styles.summaryLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Log a Meal</Text>
          
          <TouchableOpacity style={styles.primaryButton} onPress={takeMealPhoto}>
            <IconSymbol 
              ios_icon_name="camera.fill" 
              android_material_icon_name="camera-alt"
              size={24}
              color={colors.card}
            />
            <Text style={styles.primaryButtonText}>Take Photo (AI Recognition)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={pickMealPhoto}>
            <IconSymbol 
              ios_icon_name="photo.fill" 
              android_material_icon_name="photo-library"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.secondaryButtonText}>Choose from Gallery</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={() => setShowManualEntry(!showManualEntry)}
          >
            <IconSymbol 
              ios_icon_name="pencil" 
              android_material_icon_name="edit"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.secondaryButtonText}>Manual Entry</Text>
          </TouchableOpacity>
        </View>

        {/* Manual Entry Form */}
        {showManualEntry && (
          <View style={commonStyles.card}>
            <Text style={styles.cardTitle}>Enter Meal Details</Text>
            
            <TextInput
              style={styles.input}
              placeholder="Meal name (e.g., Chicken Salad)"
              placeholderTextColor={colors.textSecondary}
              value={mealName}
              onChangeText={setMealName}
            />

            <TextInput
              style={styles.input}
              placeholder="Calories"
              placeholderTextColor={colors.textSecondary}
              keyboardType="numeric"
              value={calories}
              onChangeText={setCalories}
            />

            <View style={styles.macroRow}>
              <TextInput
                style={[styles.input, styles.macroInput]}
                placeholder="Protein (g)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={protein}
                onChangeText={setProtein}
              />
              <TextInput
                style={[styles.input, styles.macroInput]}
                placeholder="Carbs (g)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={carbs}
                onChangeText={setCarbs}
              />
              <TextInput
                style={[styles.input, styles.macroInput]}
                placeholder="Fat (g)"
                placeholderTextColor={colors.textSecondary}
                keyboardType="numeric"
                value={fat}
                onChangeText={setFat}
              />
            </View>

            <TouchableOpacity style={styles.addButton} onPress={addManualMeal}>
              <Text style={styles.addButtonText}>Add Meal</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Meals List */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Today&apos;s Meals</Text>
          
          {meals.length === 0 ? (
            <View style={styles.emptyState}>
              <IconSymbol 
                ios_icon_name="fork.knife" 
                android_material_icon_name="restaurant"
                size={48}
                color={colors.textSecondary}
              />
              <Text style={styles.emptyText}>No meals logged yet</Text>
              <Text style={styles.emptySubtext}>Start by logging your first meal!</Text>
            </View>
          ) : (
            meals.map((meal) => (
              <View key={meal.id} style={styles.mealItem}>
                <View style={styles.mealHeader}>
                  <Text style={styles.mealName}>{meal.name}</Text>
                  <Text style={styles.mealTime}>{meal.time}</Text>
                </View>
                <View style={styles.mealMacros}>
                  <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                  <Text style={styles.mealMacro}>P: {meal.protein}g</Text>
                  <Text style={styles.mealMacro}>C: {meal.carbs}g</Text>
                  <Text style={styles.mealMacro}>F: {meal.fat}g</Text>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Premium Feature Banner */}
        <View style={[commonStyles.card, styles.premiumBanner]}>
          <IconSymbol 
            ios_icon_name="star.fill" 
            android_material_icon_name="star"
            size={32}
            color={colors.highlight}
          />
          <View style={styles.premiumContent}>
            <Text style={styles.premiumTitle}>Upgrade to Premium</Text>
            <Text style={styles.premiumText}>
              Get AI-powered food recognition, unlimited meal logging, and personalized nutrition recommendations
            </Text>
          </View>
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
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  primaryButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 12,
  },
  secondaryButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
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
    marginBottom: 12,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroInput: {
    flex: 1,
    marginHorizontal: 4,
  },
  addButton: {
    backgroundColor: colors.success,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
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
  mealItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  mealTime: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  mealMacros: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealCalories: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.accent,
    marginRight: 16,
  },
  mealMacro: {
    fontSize: 14,
    color: colors.textSecondary,
    marginRight: 12,
  },
  premiumBanner: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumContent: {
    flex: 1,
    marginLeft: 16,
  },
  premiumTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
    marginBottom: 4,
  },
  premiumText: {
    fontSize: 14,
    color: colors.card,
    lineHeight: 20,
  },
});
