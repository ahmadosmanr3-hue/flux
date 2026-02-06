import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Dimensions, Alert, Platform } from 'react-native';
import { useFinance } from '@/contexts/FinanceContext';
import { CATEGORIES, THEME } from '@/constants/finance';
import { GlassCard } from '@/components/GlassCard';
import { FadeIn, SlideUp, AnimatedButton } from '@/components/Animations';
import * as Haptics from 'expo-haptics';
import { PremiumBackground } from '@/components/PremiumBackground';
import { LinearGradient } from 'expo-linear-gradient';

const { width: screenWidth } = Dimensions.get('window');

export default function AddTransactionScreen() {
  const { addTransaction, exchangeRate } = useFinance();

  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'IQD'>('USD');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleTypeChange = (newType: 'income' | 'expense') => {
    if (newType !== type) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      setType(newType);
      setCategory(''); // Reset category when type changes
    }
  };

  const handleCategorySelect = (categoryId: string) => {
    Haptics.selectionAsync();
    setCategory(categoryId);
  };

  const handleCurrencyChange = (newCurrency: 'USD' | 'IQD') => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCurrency(newCurrency);
  };

  const handleSubmit = async () => {
    if (!amount || !category || !description) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsAnimating(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    addTransaction({
      amount: amountNum,
      currency,
      category,
      description,
      type,
      date: new Date().toISOString().split('T')[0],
    });

    setTimeout(() => {
      handleReset();
      setIsAnimating(false);
      Alert.alert('Success', 'Transaction added successfully');
    }, 500);
  };

  const handleReset = () => {
    setAmount('');
    setCategory('');
    setDescription('');
    setType('expense');
    setCurrency('USD');
  };

  const categories = CATEGORIES[type];
  const convertedAmount = parseFloat(amount || '0') / exchangeRate;

  return (
    <View style={styles.container}>
      <PremiumBackground />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <FadeIn delay={100}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Add Transaction</Text>
            <Text style={styles.headerSubtitle}>
              Record your income or expense
            </Text>
          </View>
        </FadeIn>

        {/* Transaction Type Toggle */}
        <SlideUp delay={200}>
          <GlassCard gradient style={styles.typeCard}>
            <Text style={styles.label}>Transaction Type</Text>
            <View style={styles.toggleContainer}>
              <AnimatedButton
                style={[
                  styles.toggleButton,
                  type === 'income' && styles.toggleButtonActiveIncome
                ]}
                onPress={() => handleTypeChange('income')}
              >
                <LinearGradient
                  colors={type === 'income' ? THEME.gradients.income : ['rgba(255,255,255,0)', 'rgba(255,255,255,0)']}
                  style={[
                    styles.toggleGradient,
                    type === 'income' && styles.toggleGradientActive
                  ]}
                >
                  <Text style={[
                    styles.toggleText,
                    { color: type === 'income' ? THEME.text : THEME.textSecondary }
                  ]}>
                    💰 Income
                  </Text>
                </LinearGradient>
              </AnimatedButton>
              <AnimatedButton
                style={[
                  styles.toggleButton,
                  type === 'expense' && styles.toggleButtonActiveExpense
                ]}
                onPress={() => handleTypeChange('expense')}
              >
                <LinearGradient
                  colors={type === 'expense' ? THEME.gradients.expense : ['rgba(255,255,255,0)', 'rgba(255,255,255,0)']}
                  style={[
                    styles.toggleGradient,
                    type === 'expense' && styles.toggleGradientActive
                  ]}
                >
                  <Text style={[
                    styles.toggleText,
                    { color: type === 'expense' ? THEME.text : THEME.textSecondary }
                  ]}>
                    💸 Expense
                  </Text>
                </LinearGradient>
              </AnimatedButton>
            </View>
          </GlassCard>
        </SlideUp>

        {/* Amount Input */}
        <SlideUp delay={300}>
          <GlassCard style={styles.amountCard}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.amountContainer}>
              <TextInput
                style={styles.amountInput}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0.00"
                placeholderTextColor={THEME.textSecondary}
                textAlign="center"
              />
              <View style={styles.currencyToggle}>
                <AnimatedButton
                  style={[
                    styles.currencyButton,
                    currency === 'USD' && styles.currencyButtonActive
                  ]}
                  onPress={() => handleCurrencyChange('USD')}
                >
                  <LinearGradient
                    colors={currency === 'USD' ? THEME.gradients.primary : ['rgba(255,255,255,0)', 'rgba(255,255,255,0)']}
                    style={[
                      styles.currencyGradient,
                      currency === 'USD' && styles.currencyGradientActive
                    ]}
                  >
                    <Text style={[
                      styles.currencyText,
                      { color: currency === 'USD' ? THEME.text : THEME.textSecondary }
                    ]}>
                      USD
                    </Text>
                  </LinearGradient>
                </AnimatedButton>
                <AnimatedButton
                  style={[
                    styles.currencyButton,
                    currency === 'IQD' && styles.currencyButtonActive
                  ]}
                  onPress={() => handleCurrencyChange('IQD')}
                >
                  <LinearGradient
                    colors={currency === 'IQD' ? THEME.gradients.primary : ['rgba(255,255,255,0)', 'rgba(255,255,255,0)']}
                    style={[
                      styles.currencyGradient,
                      currency === 'IQD' && styles.currencyGradientActive
                    ]}
                  >
                    <Text style={[
                      styles.currencyText,
                      { color: currency === 'IQD' ? THEME.text : THEME.textSecondary }
                    ]}>
                      IQD
                    </Text>
                  </LinearGradient>
                </AnimatedButton>
              </View>
            </View>
            {currency === 'IQD' && amount && (
              <FadeIn>
                <View style={styles.conversionContainer}>
                  <Text style={styles.conversionText}>
                    ≈ ${convertedAmount.toFixed(2)} USD
                  </Text>
                  <Text style={styles.exchangeRateText}>
                    Rate: 1 USD = {exchangeRate} IQD
                  </Text>
                </View>
              </FadeIn>
            )}
          </GlassCard>
        </SlideUp>

        {/* Category Selection */}
        <SlideUp delay={400}>
          <GlassCard style={styles.categoryCard}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.categoryGrid}>
              {categories.map((cat, index) => (
                <FadeIn key={cat.id} delay={500 + index * 50}>
                  <AnimatedButton
                    style={[
                      styles.categoryButton,
                      category === cat.id && styles.categoryButtonActive
                    ]}
                    onPress={() => handleCategorySelect(cat.id)}
                  >
                    <LinearGradient
                      colors={category === cat.id ? cat.gradient : ['rgba(255,255,255,0)', 'rgba(255,255,255,0)']}
                      style={[
                        styles.categoryGradient,
                        category === cat.id && styles.categoryGradientActive
                      ]}
                    >
                      <Text style={[
                        styles.categoryText,
                        { color: category === cat.id ? THEME.text : THEME.text }
                      ]}>
                        {cat.label}
                      </Text>
                    </LinearGradient>
                  </AnimatedButton>
                </FadeIn>
              ))}
            </View>
          </GlassCard>
        </SlideUp>

        {/* Description */}
        <SlideUp delay={500}>
          <GlassCard style={styles.descriptionCard}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.descriptionInput}
              value={description}
              onChangeText={setDescription}
              placeholder="Enter description..."
              placeholderTextColor={THEME.textSecondary}
              multiline
              textAlignVertical="top"
            />
          </GlassCard>
        </SlideUp>

        {/* Submit Button */}
        <SlideUp delay={600}>
          <AnimatedButton
            style={[
              styles.submitButton,
              isAnimating && styles.submitButtonPressed
            ]}
            onPress={handleSubmit}
            disabled={isAnimating}
          >
            <LinearGradient
              colors={type === 'income' ? THEME.gradients.income : THEME.gradients.expense}
              style={styles.submitGradient}
            >
              <Text style={styles.submitText}>
                {isAnimating ? 'Adding...' : `Add ${type === 'income' ? 'Income' : 'Expense'}`}
              </Text>
            </LinearGradient>
          </AnimatedButton>
        </SlideUp>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: THEME.spacing.lg,
    gap: THEME.spacing.lg,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 200, // Extra space for tab bar
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
  label: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: '600',
    marginBottom: THEME.spacing.md,
  },
  typeCard: {
    ...THEME.shadow.medium,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: THEME.glass.border,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  toggleGradient: {
    paddingVertical: THEME.spacing.md,
    borderRadius: 8,
  },
  toggleGradientActive: {
    ...THEME.shadow.small,
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  amountCard: {
    ...THEME.shadow.medium,
  },
  amountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.md,
  },
  amountInput: {
    flex: 1,
    fontSize: 36,
    color: THEME.text,
    fontWeight: 'bold',
    padding: THEME.spacing.md,
    backgroundColor: THEME.glass.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.glass.border,
    textAlign: 'center',
  },
  currencyToggle: {
    flexDirection: 'row',
    backgroundColor: THEME.glass.border,
    borderRadius: 8,
    padding: 2,
  },
  currencyButton: {
    paddingHorizontal: THEME.spacing.md,
    borderRadius: 6,
    overflow: 'hidden',
  },
  currencyGradient: {
    paddingHorizontal: THEME.spacing.md,
    paddingVertical: THEME.spacing.sm,
    borderRadius: 6,
  },
  currencyGradientActive: {
    ...THEME.shadow.small,
  },
  currencyText: {
    fontSize: 14,
    fontWeight: '600',
  },
  conversionContainer: {
    backgroundColor: THEME.glass.background,
    padding: THEME.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: THEME.glass.borderLight,
  },
  conversionText: {
    color: THEME.primary,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: THEME.spacing.xs / 2,
  },
  exchangeRateText: {
    color: THEME.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
  categoryCard: {
    ...THEME.shadow.medium,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: THEME.spacing.sm,
  },
  categoryButton: {
    borderRadius: 12,
    overflow: 'hidden',
    minWidth: (screenWidth - THEME.spacing.lg * 2 - THEME.spacing.sm) / 2,
  },
  categoryGradient: {
    paddingVertical: THEME.spacing.md,
    paddingHorizontal: THEME.spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.glass.border,
  },
  categoryGradientActive: {
    ...THEME.shadow.small,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '500',
    textAlign: 'center',
  },
  descriptionCard: {
    ...THEME.shadow.medium,
  },
  descriptionInput: {
    backgroundColor: THEME.glass.background,
    borderWidth: 1,
    borderColor: THEME.glass.border,
    borderRadius: 12,
    padding: THEME.spacing.md,
    color: THEME.text,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    borderRadius: 16,
    overflow: 'hidden',
    ...THEME.shadow.large,
  },
  submitGradient: {
    paddingVertical: THEME.spacing.lg,
    paddingHorizontal: THEME.spacing.xl,
    borderRadius: 16,
    alignItems: 'center',
  },
  submitText: {
    color: THEME.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  submitButtonPressed: {
    opacity: 0.8,
  },
  toggleButtonActiveIncome: {
    borderColor: THEME.primary,
    borderWidth: 1,
  },
  toggleButtonActiveExpense: {
    borderColor: THEME.danger,
    borderWidth: 1,
  },
  currencyButtonActive: {
    borderColor: THEME.primary,
    borderWidth: 1,
  },
  categoryButtonActive: {
    borderColor: THEME.primary,
    borderWidth: 1,
    ...Platform.select({
      web: {
        boxShadow: `0 0 16px ${THEME.primaryGlow}`,
      },
      default: {
        shadowColor: THEME.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.5,
        shadowRadius: 8,
        elevation: 4,
      }
    }),
  },
});