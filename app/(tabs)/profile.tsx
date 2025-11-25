
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('John Doe');
  const [age, setAge] = useState('28');
  const [height, setHeight] = useState('175');
  const [weight, setWeight] = useState('74');
  const [goal, setGoal] = useState('Weight Loss');

  const saveProfile = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

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
          <Text style={styles.name}>{name}</Text>
          <TouchableOpacity 
            style={styles.editButton}
            onPress={() => setIsEditing(!isEditing)}
          >
            <IconSymbol 
              ios_icon_name={isEditing ? "checkmark.circle.fill" : "pencil.circle.fill"}
              android_material_icon_name={isEditing ? "check-circle" : "edit"}
              size={20}
              color={colors.primary}
            />
            <Text style={styles.editButtonText}>
              {isEditing ? 'Save' : 'Edit Profile'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Profile Information */}
        <View style={commonStyles.card}>
          <Text style={styles.cardTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Name</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={name}
                onChangeText={setName}
              />
            ) : (
              <Text style={styles.infoValue}>{name}</Text>
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
              />
            ) : (
              <Text style={styles.infoValue}>{age} years</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Height</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={height}
                onChangeText={setHeight}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{height} cm</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={weight}
                onChangeText={setWeight}
                keyboardType="numeric"
              />
            ) : (
              <Text style={styles.infoValue}>{weight} kg</Text>
            )}
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Goal</Text>
            {isEditing ? (
              <TextInput
                style={styles.infoInput}
                value={goal}
                onChangeText={setGoal}
              />
            ) : (
              <Text style={styles.infoValue}>{goal}</Text>
            )}
          </View>

          {isEditing && (
            <TouchableOpacity style={styles.saveButton} onPress={saveProfile}>
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </TouchableOpacity>
          )}
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

        {/* Premium Features */}
        <View style={[commonStyles.card, styles.premiumCard]}>
          <Text style={styles.premiumTitle}>Premium Features</Text>
          
          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle"
              size={20}
              color={colors.success}
            />
            <Text style={styles.featureText}>AI-powered food recognition from photos</Text>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle"
              size={20}
              color={colors.success}
            />
            <Text style={styles.featureText}>Unlimited meal logging</Text>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle"
              size={20}
              color={colors.success}
            />
            <Text style={styles.featureText}>Personalized meal & workout plans</Text>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle"
              size={20}
              color={colors.success}
            />
            <Text style={styles.featureText}>Full analytics & AI insights</Text>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle"
              size={20}
              color={colors.success}
            />
            <Text style={styles.featureText}>Ad-free experience</Text>
          </View>

          <View style={styles.featureItem}>
            <IconSymbol 
              ios_icon_name="checkmark.circle.fill" 
              android_material_icon_name="check-circle"
              size={20}
              color={colors.success}
            />
            <Text style={styles.featureText}>Priority support</Text>
          </View>

          <Text style={styles.trialText}>7-day free trial • Cancel anytime</Text>
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
              ios_icon_name="lock.fill" 
              android_material_icon_name="lock"
              size={24}
              color={colors.accent}
            />
            <Text style={styles.settingText}>Privacy</Text>
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

          <TouchableOpacity style={styles.settingItem}>
            <IconSymbol 
              ios_icon_name="info.circle.fill" 
              android_material_icon_name="info"
              size={24}
              color={colors.textSecondary}
            />
            <Text style={styles.settingText}>About</Text>
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
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '600',
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
  premiumCard: {
    backgroundColor: colors.secondary,
  },
  premiumTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.card,
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureText: {
    fontSize: 14,
    color: colors.card,
    marginLeft: 12,
    flex: 1,
  },
  trialText: {
    fontSize: 14,
    color: colors.highlight,
    textAlign: 'center',
    marginTop: 16,
    fontWeight: '600',
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
