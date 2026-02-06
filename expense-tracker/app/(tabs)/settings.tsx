import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Linking } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinance } from '@/contexts/FinanceContext';
import { THEME } from '@/constants/finance';
import { GlassCard } from '@/components/GlassCard';
import { FadeIn, SlideUp, AnimatedButton } from '@/components/Animations';
import * as Haptics from 'expo-haptics';

export default function SettingsScreen() {
  const { exchangeRate, updateExchangeRate, clearAllData } = useFinance();
  const [tempExchangeRate, setTempExchangeRate] = useState(exchangeRate.toString());
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateExchangeRate = async () => {
    const rate = parseFloat(tempExchangeRate);
    if (isNaN(rate) || rate <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please enter a valid exchange rate');
      return;
    }

    setIsUpdating(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    updateExchangeRate(rate);

    setTimeout(() => {
      setIsUpdating(false);
      Alert.alert('Success', `Exchange rate updated to ${rate.toLocaleString()} IQD per USD`);
    }, 500);
  };

  const handleClearData = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete all transactions and reset settings? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
        },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => {
            clearAllData();
            setTempExchangeRate('1500');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            Alert.alert('Success', 'All data has been cleared');
          },
        },
      ]
    );
  };

  const handleContactSupport = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Linking.openURL('mailto:support@expensetracker.com');
  };

  const handleRateApp = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    // Link to app store review
    Alert.alert('Rate App', 'Thank you for using Expense Tracker! 🎉');
  };

  return (
    <LinearGradient
      colors={[THEME.background, THEME.backgroundSecondary]}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <FadeIn delay={100}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSubtitle}>
              Customize your experience
            </Text>
          </View>
        </FadeIn>

        {/* Exchange Rate Settings */}
        <SlideUp delay={200}>
          <GlassCard gradient style={styles.exchangeRateCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>Exchange Rate</Text>
              <View style={styles.rateBadge}>
                <Text style={styles.rateBadgeText}>
                  💱
                </Text>
              </View>
            </View>
            <Text style={styles.description}>
              Set the conversion rate from USD to IQD
            </Text>
            <View style={styles.exchangeRateContainer}>
              <TextInput
                style={styles.exchangeInput}
                value={tempExchangeRate}
                onChangeText={setTempExchangeRate}
                keyboardType="numeric"
                placeholder="1500"
                placeholderTextColor={THEME.textSecondary}
                textAlign="center"
              />
            </View>
            <AnimatedButton
              style={isUpdating ? [styles.updateButton, styles.updateButtonPressed] : styles.updateButton}
              onPress={handleUpdateExchangeRate}
              disabled={isUpdating}
            >
              <LinearGradient
                colors={THEME.gradients.primary}
                style={styles.updateGradient}
              >
                <Text style={styles.updateText}>
                  {isUpdating ? 'Updating...' : 'Update Rate'}
                </Text>
              </LinearGradient>
            </AnimatedButton>
          </GlassCard>
        </SlideUp>

        {/* Current Rate Display */}
        <SlideUp delay={300}>
          <GlassCard style={styles.currentRateCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>Current Exchange Rate</Text>
              <Text style={styles.currentRateDate}>
                Updated today
              </Text>
            </View>
            <LinearGradient
              colors={THEME.gradients.glass}
              style={styles.currentRateContainer}
            >
              <Text style={styles.currentRateText}>
                1 USD = {exchangeRate.toLocaleString()} IQD
              </Text>
              <Text style={styles.currentRateSubtext}>
                1 IQD = {(1 / exchangeRate).toFixed(6)} USD
              </Text>
            </LinearGradient>
            <View style={styles.rateChart}>
              <View style={[styles.rateBar, { width: `${Math.min(exchangeRate / 20, 100)}%` }]} />
            </View>
          </GlassCard>
        </SlideUp>

        {/* Data Management */}
        <SlideUp delay={400}>
          <GlassCard style={styles.dataManagementCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>Data Management</Text>
              <View style={styles.dangerBadge}>
                <Text style={styles.dangerBadgeText}>
                  ⚠️
                </Text>
              </View>
            </View>
            <Text style={styles.description}>
              Manage your transaction data and settings
            </Text>
            <AnimatedButton
              style={styles.clearButton}
              onPress={handleClearData}
            >
              <LinearGradient
                colors={THEME.gradients.expense}
                style={styles.clearGradient}
              >
                <Text style={styles.clearText}>Clear All Data</Text>
              </LinearGradient>
            </AnimatedButton>
          </GlassCard>
        </SlideUp>

        {/* App Information */}
        <SlideUp delay={500}>
          <GlassCard style={styles.aboutCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>About</Text>
              <View style={styles.infoBadge}>
                <Text style={styles.infoBadgeText}>
                  ℹ️
                </Text>
              </View>
            </View>
            <View style={styles.appInfo}>
              <Text style={styles.appName}>Expense Tracker</Text>
              <Text style={styles.appVersion}>Version 1.0.0</Text>
              <Text style={styles.appDescription}>
                A modern expense tracking app with glassmorphic design and smooth animations.
                Perfect for managing your income and expenses in USD and IQD with real-time currency conversion.
              </Text>
            </View>
            <View style={styles.actionsContainer}>
              <AnimatedButton
                style={styles.actionButton}
                onPress={handleRateApp}
              >
                <LinearGradient
                  colors={THEME.gradients.primary}
                  style={styles.actionGradient}
                >
                  <Text style={styles.actionText}>⭐ Rate App</Text>
                </LinearGradient>
              </AnimatedButton>
              <AnimatedButton
                style={styles.actionButton}
                onPress={handleContactSupport}
              >
                <LinearGradient
                  colors={THEME.gradients.glass}
                  style={styles.actionGradient}
                >
                  <Text style={styles.actionText}>📧 Contact Support</Text>
                </LinearGradient>
              </AnimatedButton>
            </View>
          </GlassCard>
        </SlideUp>

        {/* Statistics */}
        <SlideUp delay={600}>
          <GlassCard style={styles.statsCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.label}>Statistics</Text>
              <View style={styles.statsBadge}>
                <Text style={styles.statsBadgeText}>
                  📊
                </Text>
              </View>
            </View>
            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {exchangeRate.toLocaleString()}
                </Text>
                <Text style={styles.statLabel}>IQD Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  2
                </Text>
                <Text style={styles.statLabel}>Currencies</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  8
                </Text>
                <Text style={styles.statLabel}>Categories</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  OLED
                </Text>
                <Text style={styles.statLabel}>Optimized</Text>
              </View>
            </View>
          </GlassCard>
        </SlideUp>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: THEME.spacing.lg,
    gap: THEME.spacing.lg,
    paddingBottom: 120, // Space for floating tab bar
  },
  header: {
    marginBottom: THEME.spacing.md,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: THEME.text,
    marginBottom: THEME.spacing.xs,
  },
  headerSubtitle: {
    fontSize: 16,
    color: THEME.textSecondary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  label: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '600',
  },
  description: {
    color: THEME.textSecondary,
    fontSize: 14,
    marginBottom: THEME.spacing.lg,
    lineHeight: 20,
  },
  rateBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.glass.background,
    borderWidth: 1,
    borderColor: THEME.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rateBadgeText: {
    fontSize: 16,
  },
  exchangeRateCard: {
    ...THEME.shadow.medium,
  },
  exchangeRateContainer: {
    marginBottom: THEME.spacing.lg,
  },
  exchangeInput: {
    backgroundColor: THEME.glass.background,
    borderWidth: 1,
    borderColor: THEME.glass.border,
    borderRadius: 12,
    padding: THEME.spacing.md,
    color: THEME.text,
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
  },
  updateButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...THEME.shadow.small,
  },
  updateGradient: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
  },
  updateText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  updateButtonPressed: {
    opacity: 0.8,
  },
  currentRateCard: {
    ...THEME.shadow.medium,
  },
  currentRateDate: {
    color: THEME.textSecondary,
    fontSize: 12,
    backgroundColor: THEME.glass.background,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: 8,
  },
  currentRateContainer: {
    padding: THEME.spacing.lg,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
  },
  currentRateText: {
    color: THEME.text,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  currentRateSubtext: {
    color: THEME.textSecondary,
    fontSize: 14,
  },
  rateChart: {
    height: 4,
    backgroundColor: THEME.glass.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  rateBar: {
    height: '100%',
    backgroundColor: THEME.primary,
    borderRadius: 2,
  },
  dataManagementCard: {
    ...THEME.shadow.medium,
  },
  dangerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: `${THEME.danger}20`,
    borderWidth: 1,
    borderColor: THEME.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dangerBadgeText: {
    fontSize: 16,
  },
  clearButton: {
    borderRadius: 12,
    overflow: 'hidden',
    ...THEME.shadow.small,
  },
  clearGradient: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: 12,
    alignItems: 'center',
  },
  clearText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
  },
  aboutCard: {
    ...THEME.shadow.medium,
  },
  infoBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.glass.background,
    borderWidth: 1,
    borderColor: THEME.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBadgeText: {
    fontSize: 16,
  },
  appInfo: {
    marginBottom: THEME.spacing.lg,
  },
  appName: {
    color: THEME.text,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  appVersion: {
    color: THEME.textSecondary,
    fontSize: 14,
    marginBottom: THEME.spacing.md,
  },
  appDescription: {
    color: THEME.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
  },
  actionButton: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
    ...THEME.shadow.small,
  },
  actionGradient: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
  },
  actionText: {
    color: THEME.text,
    fontSize: 14,
    fontWeight: '600',
  },
  statsCard: {
    ...THEME.shadow.medium,
  },
  statsBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: THEME.glass.background,
    borderWidth: 1,
    borderColor: THEME.glass.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsBadgeText: {
    fontSize: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.md,
  },
  statItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: THEME.glass.background,
    padding: THEME.spacing.md,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: THEME.glass.border,
  },
  statNumber: {
    color: THEME.primary,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  statLabel: {
    color: THEME.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});