
import { IconSymbol } from '@/components/IconSymbol';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Platform } from 'react-native';
import React, { useState } from 'react';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useContentGeneration } from '@/hooks/useContentGeneration';

type ContentType = 'workout' | 'meal-plan' | 'motivation' | 'tips' | 'custom';

interface ContentTypeOption {
  id: ContentType;
  label: string;
  icon: string;
  description: string;
  placeholder: string;
}

const CONTENT_TYPES: ContentTypeOption[] = [
  {
    id: 'workout',
    label: 'Workout Plan',
    icon: 'fitness-center',
    description: 'Generate detailed workout routines',
    placeholder: 'E.g., "Create a 30-minute HIIT workout for beginners"',
  },
  {
    id: 'meal-plan',
    label: 'Meal Plan',
    icon: 'restaurant',
    description: 'Create healthy meal plans',
    placeholder: 'E.g., "Generate a high-protein meal plan for muscle gain"',
  },
  {
    id: 'motivation',
    label: 'Motivation',
    icon: 'emoji-events',
    description: 'Get motivational content',
    placeholder: 'E.g., "Write a motivational message for staying consistent"',
  },
  {
    id: 'tips',
    label: 'Fitness Tips',
    icon: 'lightbulb',
    description: 'Get practical fitness tips',
    placeholder: 'E.g., "Give me 5 tips for better sleep and recovery"',
  },
  {
    id: 'custom',
    label: 'Custom',
    icon: 'edit',
    description: 'Generate any fitness content',
    placeholder: 'E.g., "Explain the benefits of strength training"',
  },
];

export default function ContentGeneratorScreen() {
  const [selectedType, setSelectedType] = useState<ContentType>('workout');
  const [prompt, setPrompt] = useState('');
  const { generate, loading, error, generatedText, reset } = useContentGeneration();

  const selectedOption = CONTENT_TYPES.find(t => t.id === selectedType) || CONTENT_TYPES[0];

  const handleGenerate = async () => {
    console.log('User tapped Generate Content button');
    if (!prompt.trim()) {
      console.log('Content generation: Empty prompt');
      return;
    }

    console.log('Generating content with type:', selectedType, 'prompt:', prompt);
    await generate({
      prompt,
      contentType: selectedType,
      format: 'markdown',
      model: 'gpt-4o',
    });
  };

  const handleReset = () => {
    console.log('User tapped Reset button');
    reset();
    setPrompt('');
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="sparkles" 
            android_material_icon_name="auto-awesome" 
            size={32} 
            color={colors.primary} 
          />
          <Text style={styles.title}>AI Content Generator</Text>
          <Text style={styles.subtitle}>
            Generate fitness content powered by GPT-4
          </Text>
        </View>

        {/* Content Type Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Content Type</Text>
          <View style={styles.typeGrid}>
            {CONTENT_TYPES.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.typeCard,
                  selectedType === type.id && styles.typeCardSelected,
                ]}
                onPress={() => {
                  console.log('User selected content type:', type.id);
                  setSelectedType(type.id);
                  setPrompt('');
                  reset();
                }}
              >
                <IconSymbol
                  ios_icon_name={type.icon}
                  android_material_icon_name={type.icon}
                  size={24}
                  color={selectedType === type.id ? colors.primary : colors.text}
                />
                <Text style={[
                  styles.typeLabel,
                  selectedType === type.id && styles.typeLabelSelected,
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.typeDescription}>{selectedOption.description}</Text>
        </View>

        {/* Prompt Input */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Your Prompt</Text>
          <TextInput
            style={styles.promptInput}
            placeholder={selectedOption.placeholder}
            placeholderTextColor={colors.textSecondary}
            value={prompt}
            onChangeText={setPrompt}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        {/* Generate Button */}
        <TouchableOpacity
          style={[
            styles.generateButton,
            (!prompt.trim() || loading) && styles.generateButtonDisabled,
          ]}
          onPress={handleGenerate}
          disabled={!prompt.trim() || loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <IconSymbol
                ios_icon_name="sparkles"
                android_material_icon_name="auto-awesome"
                size={20}
                color="#fff"
              />
              <Text style={styles.generateButtonText}>Generate Content</Text>
            </>
          )}
        </TouchableOpacity>

        {/* Error Display */}
        {error && (
          <View style={styles.errorContainer}>
            <IconSymbol
              ios_icon_name="exclamationmark.triangle"
              android_material_icon_name="error"
              size={20}
              color={colors.error}
            />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Generated Content */}
        {generatedText && (
          <View style={styles.section}>
            <View style={styles.resultHeader}>
              <Text style={styles.sectionTitle}>Generated Content</Text>
              <TouchableOpacity onPress={handleReset} style={styles.resetButton}>
                <IconSymbol
                  ios_icon_name="arrow.clockwise"
                  android_material_icon_name="refresh"
                  size={20}
                  color={colors.primary}
                />
                <Text style={styles.resetButtonText}>New</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.resultContainer}>
              <ScrollView 
                style={styles.resultScroll}
                nestedScrollEnabled
                showsVerticalScrollIndicator={true}
              >
                <Text style={styles.resultText}>{generatedText}</Text>
              </ScrollView>
            </View>
          </View>
        )}

        {/* Info Card */}
        {!generatedText && !loading && (
          <View style={styles.infoCard}>
            <IconSymbol
              ios_icon_name="info.circle"
              android_material_icon_name="info"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.infoText}>
              Select a content type, enter your prompt, and let AI generate personalized fitness content for you.
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 48 : 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 12,
  },
  typeCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeCardSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  typeLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginTop: 8,
    textAlign: 'center',
  },
  typeLabelSelected: {
    color: colors.primary,
  },
  typeDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  promptInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
    borderWidth: 1,
    borderColor: colors.border,
  },
  generateButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  generateButtonDisabled: {
    opacity: 0.5,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    backgroundColor: colors.errorLight,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontSize: 14,
  },
  resultHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
  },
  resetButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    maxHeight: 400,
    borderWidth: 1,
    borderColor: colors.border,
  },
  resultScroll: {
    flex: 1,
  },
  resultText: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
  },
  infoCard: {
    backgroundColor: colors.primaryLight,
    borderRadius: 12,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
});
