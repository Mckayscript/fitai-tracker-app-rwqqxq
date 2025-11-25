
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import type { FoodItem } from '@/hooks/useFoodAnalysis';

interface FoodConfirmationModalProps {
  visible: boolean;
  imageUri: string;
  foods: FoodItem[];
  onConfirm: (foods: FoodItem[]) => void;
  onCancel: () => void;
}

export function FoodConfirmationModal({
  visible,
  imageUri,
  foods: initialFoods,
  onConfirm,
  onCancel,
}: FoodConfirmationModalProps) {
  const [foods, setFoods] = useState<FoodItem[]>(initialFoods);

  const updateFood = (index: number, field: keyof FoodItem, value: string) => {
    const updatedFoods = [...foods];
    const numValue = parseFloat(value) || 0;
    
    if (field === 'portion_size_grams') {
      const ratio = numValue / updatedFoods[index].portion_size_grams;
      updatedFoods[index] = {
        ...updatedFoods[index],
        portion_size_grams: numValue,
        calories: Math.round(updatedFoods[index].calories * ratio),
        protein: Math.round(updatedFoods[index].protein * ratio * 10) / 10,
        carbs: Math.round(updatedFoods[index].carbs * ratio * 10) / 10,
        fat: Math.round(updatedFoods[index].fat * ratio * 10) / 10,
      };
    } else if (field === 'name') {
      updatedFoods[index] = {
        ...updatedFoods[index],
        name: value,
      };
    } else {
      updatedFoods[index] = {
        ...updatedFoods[index],
        [field]: numValue,
      };
    }
    
    setFoods(updatedFoods);
  };

  const removeFood = (index: number) => {
    const updatedFoods = foods.filter((_, i) => i !== index);
    if (updatedFoods.length === 0) {
      Alert.alert('Error', 'You must have at least one food item.');
      return;
    }
    setFoods(updatedFoods);
  };

  const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0);
  const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0);
  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0);
  const totalFat = foods.reduce((sum, f) => sum + f.fat, 0);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onCancel}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onCancel} style={styles.closeButton}>
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Confirm Meal Details</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Image Preview */}
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
          </View>

          {/* Disclaimer */}
          <View style={styles.disclaimer}>
            <IconSymbol
              ios_icon_name="info.circle.fill"
              android_material_icon_name="info"
              size={20}
              color={colors.warning}
            />
            <Text style={styles.disclaimerText}>
              These values are AI estimates and may not be 100% accurate. Adjust portion sizes as needed.
            </Text>
          </View>

          {/* Tips */}
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>💡 Tips for Better Accuracy</Text>
            <Text style={styles.tipText}>- Place a fork or hand next to your meal for scale reference</Text>
            <Text style={styles.tipText}>- Take photos in good lighting</Text>
            <Text style={styles.tipText}>- Capture the entire meal in frame</Text>
            <Text style={styles.tipText}>- Adjust portion sizes if they seem off</Text>
          </View>

          {/* Food Items */}
          {foods.map((food, index) => (
            <View key={index} style={styles.foodCard}>
              <View style={styles.foodHeader}>
                <Text style={styles.foodName}>{food.name}</Text>
                {foods.length > 1 && (
                  <TouchableOpacity onPress={() => removeFood(index)}>
                    <IconSymbol
                      ios_icon_name="trash"
                      android_material_icon_name="delete"
                      size={20}
                      color={colors.error}
                    />
                  </TouchableOpacity>
                )}
              </View>

              <View style={styles.confidenceBar}>
                <View style={styles.confidenceBarFill} />
                <Text style={styles.confidenceText}>
                  Confidence: {Math.round(food.confidence * 100)}%
                </Text>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Portion (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(food.portion_size_grams)}
                    onChangeText={(value) => updateFood(index, 'portion_size_grams', value)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Calories</Text>
                  <TextInput
                    style={styles.input}
                    value={String(food.calories)}
                    onChangeText={(value) => updateFood(index, 'calories', value)}
                    keyboardType="numeric"
                  />
                </View>
              </View>

              <View style={styles.inputRow}>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Protein (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(food.protein)}
                    onChangeText={(value) => updateFood(index, 'protein', value)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Carbs (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(food.carbs)}
                    onChangeText={(value) => updateFood(index, 'carbs', value)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Fat (g)</Text>
                  <TextInput
                    style={styles.input}
                    value={String(food.fat)}
                    onChangeText={(value) => updateFood(index, 'fat', value)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </View>
          ))}

          {/* Total Summary */}
          <View style={styles.summaryCard}>
            <Text style={styles.summaryTitle}>Total Nutrition</Text>
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

          {/* Confirm Button */}
          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => onConfirm(foods)}
          >
            <Text style={styles.confirmButtonText}>Confirm & Save Meal</Text>
          </TouchableOpacity>

          <View style={styles.bottomPadding} />
        </ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 48,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  closeButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  image: {
    width: '100%',
    height: 200,
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3CD',
    padding: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 8,
  },
  disclaimerText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 13,
    color: '#856404',
    lineHeight: 18,
  },
  tipsCard: {
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  foodCard: {
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  foodHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  confidenceBar: {
    marginBottom: 16,
  },
  confidenceBarFill: {
    height: 4,
    backgroundColor: colors.success,
    borderRadius: 2,
    marginBottom: 4,
  },
  confidenceText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  inputGroup: {
    flex: 1,
    marginHorizontal: 4,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
  },
  summaryCard: {
    backgroundColor: colors.primary,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.card,
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
  },
  summaryLabel: {
    fontSize: 12,
    color: colors.card,
    marginTop: 4,
  },
  confirmButton: {
    backgroundColor: colors.success,
    paddingVertical: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
  },
  bottomPadding: {
    height: 32,
  },
});
