
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Platform } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function TestingGuideScreen() {
  const openLink = (url: string) => {
    Linking.openURL(url);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <IconSymbol 
          ios_icon_name="checkmark.circle.fill" 
          android_material_icon_name="check-circle" 
          size={48} 
          color={colors.primary} 
        />
        <Text style={styles.title}>Testing Your App</Text>
        <Text style={styles.subtitle}>
          Get the full testing experience beyond preview mode
        </Text>
      </View>

      {/* Current Environment */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current Environment</Text>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Platform:</Text>
            <Text style={styles.value}>{Platform.OS}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Version:</Text>
            <Text style={styles.value}>{Platform.Version}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Mode:</Text>
            <Text style={styles.value}>{__DEV__ ? 'Development' : 'Production'}</Text>
          </View>
        </View>
      </View>

      {/* Testing Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Testing Options</Text>

        {/* Option 1: Physical Device */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => openLink('https://docs.expo.dev/get-started/set-up-your-environment/')}
        >
          <View style={styles.optionHeader}>
            <IconSymbol 
              ios_icon_name="iphone" 
              android_material_icon_name="phone-android" 
              size={32} 
              color={colors.primary} 
            />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>1. Test on Physical Device</Text>
              <Text style={styles.optionDescription}>
                Install Expo Go app on your phone and scan the QR code
              </Text>
            </View>
          </View>
          <View style={styles.steps}>
            <Text style={styles.step}>• Download "Expo Go" from App Store or Google Play</Text>
            <Text style={styles.step}>• Run: npm run dev</Text>
            <Text style={styles.step}>• Scan QR code with Expo Go app</Text>
            <Text style={styles.step}>• Test all features including camera, notifications, etc.</Text>
          </View>
        </TouchableOpacity>

        {/* Option 2: iOS Simulator */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => openLink('https://docs.expo.dev/workflow/ios-simulator/')}
        >
          <View style={styles.optionHeader}>
            <IconSymbol 
              ios_icon_name="laptopcomputer" 
              android_material_icon_name="computer" 
              size={32} 
              color={colors.primary} 
            />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>2. iOS Simulator (Mac only)</Text>
              <Text style={styles.optionDescription}>
                Test on virtual iPhone devices
              </Text>
            </View>
          </View>
          <View style={styles.steps}>
            <Text style={styles.step}>• Install Xcode from Mac App Store</Text>
            <Text style={styles.step}>• Run: npm run ios</Text>
            <Text style={styles.step}>• Simulator will launch automatically</Text>
            <Text style={styles.step}>• Test iOS-specific features</Text>
          </View>
        </TouchableOpacity>

        {/* Option 3: Android Emulator */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => openLink('https://docs.expo.dev/workflow/android-studio-emulator/')}
        >
          <View style={styles.optionHeader}>
            <IconSymbol 
              ios_icon_name="laptopcomputer" 
              android_material_icon_name="computer" 
              size={32} 
              color={colors.primary} 
            />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>3. Android Emulator</Text>
              <Text style={styles.optionDescription}>
                Test on virtual Android devices
              </Text>
            </View>
          </View>
          <View style={styles.steps}>
            <Text style={styles.step}>• Install Android Studio</Text>
            <Text style={styles.step}>• Set up Android Virtual Device (AVD)</Text>
            <Text style={styles.step}>• Run: npm run android</Text>
            <Text style={styles.step}>• Test Android-specific features</Text>
          </View>
        </TouchableOpacity>

        {/* Option 4: Development Build */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => openLink('https://docs.expo.dev/develop/development-builds/introduction/')}
        >
          <View style={styles.optionHeader}>
            <IconSymbol 
              ios_icon_name="hammer.fill" 
              android_material_icon_name="build" 
              size={32} 
              color={colors.primary} 
            />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>4. Development Build (Recommended)</Text>
              <Text style={styles.optionDescription}>
                Full native features + custom native code
              </Text>
            </View>
          </View>
          <View style={styles.steps}>
            <Text style={styles.step}>• Run: npx expo install expo-dev-client</Text>
            <Text style={styles.step}>• Run: npx expo run:ios or npx expo run:android</Text>
            <Text style={styles.step}>• Test with all native capabilities</Text>
            <Text style={styles.step}>• Best for testing camera, payments, etc.</Text>
          </View>
        </TouchableOpacity>

        {/* Option 5: Production Build */}
        <TouchableOpacity 
          style={styles.optionCard}
          onPress={() => openLink('https://docs.expo.dev/build/introduction/')}
        >
          <View style={styles.optionHeader}>
            <IconSymbol 
              ios_icon_name="app.badge.checkmark" 
              android_material_icon_name="verified" 
              size={32} 
              color={colors.primary} 
            />
            <View style={styles.optionText}>
              <Text style={styles.optionTitle}>5. Production Build (EAS Build)</Text>
              <Text style={styles.optionDescription}>
                Test the actual app that users will download
              </Text>
            </View>
          </View>
          <View style={styles.steps}>
            <Text style={styles.step}>• Run: npm install -g eas-cli</Text>
            <Text style={styles.step}>• Run: eas build --platform ios --profile preview</Text>
            <Text style={styles.step}>• Run: eas build --platform android --profile preview</Text>
            <Text style={styles.step}>• Install .ipa (iOS) or .apk (Android) on device</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* What to Test */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>What to Test in FitAI Tracker</Text>
        <View style={styles.card}>
          <Text style={styles.testItem}>✓ Camera - Take meal photos</Text>
          <Text style={styles.testItem}>✓ AI Food Recognition - Analyze meals</Text>
          <Text style={styles.testItem}>✓ Image Upload - Pick from gallery</Text>
          <Text style={styles.testItem}>✓ Workout Generation - AI-powered routines</Text>
          <Text style={styles.testItem}>✓ Daily Checklist - Track workout progress</Text>
          <Text style={styles.testItem}>✓ Profile Management - Save fitness goals</Text>
          <Text style={styles.testItem}>✓ Data Persistence - Supabase integration</Text>
          <Text style={styles.testItem}>✓ Charts & Progress - Visualizations</Text>
          <Text style={styles.testItem}>✓ Dark Mode - Theme switching</Text>
          <Text style={styles.testItem}>✓ Navigation - All screens and flows</Text>
        </View>
      </View>

      {/* Quick Commands */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Commands</Text>
        <View style={styles.commandCard}>
          <Text style={styles.command}>npm run dev</Text>
          <Text style={styles.commandDesc}>Start development server with tunnel</Text>
        </View>
        <View style={styles.commandCard}>
          <Text style={styles.command}>npm run ios</Text>
          <Text style={styles.commandDesc}>Run on iOS simulator (Mac only)</Text>
        </View>
        <View style={styles.commandCard}>
          <Text style={styles.command}>npm run android</Text>
          <Text style={styles.commandDesc}>Run on Android emulator</Text>
        </View>
        <View style={styles.commandCard}>
          <Text style={styles.command}>npx expo run:ios</Text>
          <Text style={styles.commandDesc}>Build and run development build (iOS)</Text>
        </View>
        <View style={styles.commandCard}>
          <Text style={styles.command}>npx expo run:android</Text>
          <Text style={styles.commandDesc}>Build and run development build (Android)</Text>
        </View>
      </View>

      {/* Tips */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pro Tips</Text>
        <View style={styles.card}>
          <Text style={styles.tip}>💡 Use physical devices for camera and AI features</Text>
          <Text style={styles.tip}>💡 Test on both iOS and Android for cross-platform issues</Text>
          <Text style={styles.tip}>💡 Development builds give you the most accurate testing</Text>
          <Text style={styles.tip}>💡 Check console logs for debugging (shake device → Debug)</Text>
          <Text style={styles.tip}>💡 Test with slow network to simulate real conditions</Text>
          <Text style={styles.tip}>💡 Clear app data between tests for fresh state</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          For detailed documentation, visit docs.expo.dev
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  label: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  optionCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  optionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  optionText: {
    flex: 1,
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  optionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  steps: {
    marginTop: 8,
  },
  step: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  testItem: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  commandCard: {
    backgroundColor: colors.cardBackground,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  command: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    marginBottom: 4,
  },
  commandDesc: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  tip: {
    fontSize: 15,
    color: colors.text,
    marginBottom: 10,
    lineHeight: 22,
  },
  footer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
