
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { FoodConfirmationModal } from '@/components/FoodConfirmationModal';
import { useFoodAnalysis, type FoodItem } from '@/hooks/useFoodAnalysis';
import { supabase } from '@/app/integrations/supabase/client';
import * as ImagePicker from 'expo-image-picker';

interface MealEntry {
  id: string;
  food_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portion_size_grams?: number;
  image_url?: string;
  created_at: string;
}

export default function MealsScreen() {
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [currentImageUri, setCurrentImageUri] = useState('');
  const [analyzedFoods, setAnalyzedFoods] = useState<FoodItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const { analyzeFood, loading: analyzing, error: analysisError } = useFoodAnalysis();

  useEffect(() => {
    checkAuth();
    loadMeals();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUserId(user?.id || null);
  };

  const loadMeals = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.log('No user logged in');
        return;
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const { data, error } = await supabase
        .from('meal_entries')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString())
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading meals:', error);
        return;
      }

      setMeals(data || []);
    } catch (err) {
      console.error('Error in loadMeals:', err);
    }
  };

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Camera permission is needed to take photos of your meals.');
      return false;
    }
    return true;
  };

  const uploadImageToStorage = async (imageUri: string): Promise<string | null> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(imageUri);
      const blob = await response.blob();
      
      const fileExt = imageUri.split('.').pop() || 'jpg';
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('meal-images')
        .upload(filePath, blob, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error:', uploadError);
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('meal-images')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      return null;
    }
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

    if (!result.canceled && result.assets[0]) {
      await handleImageAnalysis(result.assets[0].uri);
    }
  };

  const pickMealPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      await handleImageAnalysis(result.assets[0].uri);
    }
  };

  const handleImageAnalysis = async (imageUri: string) => {
    if (!userId) {
      Alert.alert('Authentication Required', 'Please log in to use AI food recognition.');
      return;
    }

    setCurrentImageUri(imageUri);
    
    const analysisResult = await analyzeFood(imageUri);
    
    if (analysisResult && analysisResult.foods.length > 0) {
      setAnalyzedFoods(analysisResult.foods);
      setShowConfirmation(true);
    } else {
      Alert.alert(
        'Analysis Failed',
        analysisError || 'Could not analyze the image. Please try again or use manual entry.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleConfirmMeal = async (foods: FoodItem[]) => {
    setShowConfirmation(false);
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        Alert.alert('Error', 'You must be logged in to save meals.');
        setLoading(false);
        return;
      }

      const imageUrl = await uploadImageToStorage(currentImageUri);

      const mealEntries = foods.map(food => ({
        user_id: user.id,
        food_name: food.name,
        calories: food.calories,
        protein: food.protein,
        carbs: food.carbs,
        fat: food.fat,
        portion_size_grams: food.portion_size_grams,
        image_url: imageUrl,
      }));

      const { error } = await supabase
        .from('meal_entries')
        .insert(mealEntries);

      if (error) {
        console.error('Error saving meal:', error);
        Alert.alert('Error', 'Failed to save meal. Please try again.');
      } else {
        Alert.alert('Success', 'Meal logged successfully!');
        await loadMeals();
      }
    } catch (err) {
      console.error('Error in handleConfirmMeal:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
      setCurrentImageUri('');
      setAnalyzedFoods([]);
    }
  };

  const addManualMeal = async () => {
    if (!mealName || !calories) {
      Alert.alert('Missing Information', 'Please enter at least meal name and calories.');
      return;
    }

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      Alert.alert('Error', 'You must be logged in to save meals.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from('meal_entries')
        .insert({
          user_id: user.id,
          food_name: mealName,
          calories: parseInt(calories) || 0,
          protein: parseFloat(protein) || 0,
          carbs: parseFloat(carbs) || 0,
          fat: parseFloat(fat) || 0,
        });

      if (error) {
        console.error('Error saving meal:', error);
        Alert.alert('Error', 'Failed to save meal. Please try again.');
      } else {
        setMealName('');
        setCalories('');
        setProtein('');
        setCarbs('');
        setFat('');
        setShowManualEntry(false);
        Alert.alert('Success', 'Meal logged successfully!');
        await loadMeals();
      }
    } catch (err) {
      console.error('Error in addManualMeal:', err);
      Alert.alert('Error', 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
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
          <Text style={styles.subtitle}>AI-powered food recognition</Text>
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
              <Text style={styles.summaryValue}>{totalProtein.toFixed(1)}g</Text>
              <Text style={styles.summaryLabel}>Protein</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalCarbs.toFixed(1)}g</Text>
              <Text style={styles.summaryLabel}>Carbs</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{totalFat.toFixed(1)}g</Text>
              <Text style={styles.summaryLabel}>Fat</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Log a Meal</Text>
          
          <TouchableOpacity 
            style={styles.primaryButton} 
            onPress={takeMealPhoto}
            disabled={analyzing || loading}
          >
            {analyzing ? (
              <ActivityIndicator color={colors.card} />
            ) : (
              <>
                <IconSymbol 
                  ios_icon_name="camera.fill" 
                  android_material_icon_name="camera-alt"
                  size={24}
                  color={colors.card}
                />
                <Text style={styles.primaryButtonText}>Take Photo (AI Recognition)</Text>
              </>
            )}
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.secondaryButton} 
            onPress={pickMealPhoto}
            disabled={analyzing || loading}
          >
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
            disabled={loading}
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

            <TouchableOpacity 
              style={styles.addButton} 
              onPress={addManualMeal}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.card} />
              ) : (
                <Text style={styles.addButtonText}>Add Meal</Text>
              )}
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
                {meal.image_url && (
                  <Image 
                    source={{ uri: meal.image_url }} 
                    style={styles.mealImage}
                    resizeMode="cover"
                  />
                )}
                <View style={styles.mealContent}>
                  <View style={styles.mealHeader}>
                    <Text style={styles.mealName}>{meal.food_name}</Text>
                    <Text style={styles.mealTime}>
                      {new Date(meal.created_at).toLocaleTimeString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </Text>
                  </View>
                  <View style={styles.mealMacros}>
                    <Text style={styles.mealCalories}>{meal.calories} cal</Text>
                    <Text style={styles.mealMacro}>P: {meal.protein.toFixed(1)}g</Text>
                    <Text style={styles.mealMacro}>C: {meal.carbs.toFixed(1)}g</Text>
                    <Text style={styles.mealMacro}>F: {meal.fat.toFixed(1)}g</Text>
                  </View>
                  {meal.portion_size_grams && (
                    <Text style={styles.portionText}>
                      Portion: {meal.portion_size_grams}g
                    </Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {/* Disclaimer */}
        <View style={[commonStyles.card, styles.disclaimerCard]}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <View style={styles.disclaimerContent}>
            <Text style={styles.disclaimerTitle}>Medical Disclaimer</Text>
            <Text style={styles.disclaimerText}>
              Nutritional values are AI-generated estimates and may not be 100% accurate. 
              This app is not a substitute for professional medical or nutritional advice. 
              Consult with a healthcare provider for personalized dietary guidance.
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <FoodConfirmationModal
          visible={showConfirmation}
          imageUri={currentImageUri}
          foods={analyzedFoods}
          onConfirm={handleConfirmMeal}
          onCancel={() => {
            setShowConfirmation(false);
            setCurrentImageUri('');
            setAnalyzedFoods([]);
          }}
        />
      )}

      {/* Loading Overlay */}
      {(analyzing || loading) && !showConfirmation && (
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>
              {analyzing ? 'Analyzing your food...' : 'Saving meal...'}
            </Text>
          </View>
        </View>
      )}
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
    minHeight: 50,
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
    minHeight: 50,
    justifyContent: 'center',
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
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  mealImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  mealContent: {
    flex: 1,
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
    flex: 1,
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
  portionText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  disclaimerCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  disclaimerContent: {
    flex: 1,
    marginLeft: 12,
  },
  disclaimerTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  disclaimerText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: colors.card,
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
});
