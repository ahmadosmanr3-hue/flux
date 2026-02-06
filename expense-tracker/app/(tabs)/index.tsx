import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useFinance } from '@/contexts/FinanceContext';
import { THEME } from '@/constants/finance';
import { GlassCard } from '@/components/GlassCard';
import { FadeIn, SlideUp, AnimatedButton } from '@/components/Animations';

const { width: screenWidth } = Dimensions.get('window');

export default function DashboardScreen() {
  const { getNetWorth, getCurrentMonthRevenue, getRecentTransactions } = useFinance();
  const [animatedValues, setAnimatedValues] = useState({
    netWorth: 0,
    revenue: 0,
  });

  const netWorth = getNetWorth();
  const monthlyRevenue = getCurrentMonthRevenue();
  const recentTransactions = getRecentTransactions();

  // Animate number counting
  useEffect(() => {
    const animateValue = (target: number, key: 'netWorth' | 'revenue', duration = 1000) => {
      const startValue = animatedValues[key];
      const startTime = Date.now();

      const animate = () => {
        const now = Date.now();
        const progress = Math.min((now - startTime) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = startValue + (target - startValue) * easeOutQuart;

        setAnimatedValues(prev => ({ ...prev, [key]: currentValue }));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      animate();
    };

    animateValue(Math.abs(netWorth.usd), 'netWorth');
    animateValue(monthlyRevenue, 'revenue');
  }, [netWorth.usd, monthlyRevenue]);

  const formatCurrency = (amount: number, currency: 'USD' | 'IQD') => {
    if (currency === 'IQD') {
      return `IQD ${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
    }
    return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  };

  const getTransactionColor = (category: string, type: string) => {
    if (type === 'income') {
      const categoryData = THEME.gradients.primary;
      return categoryData[0];
    }
    return THEME.danger;
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
            <Text style={styles.headerTitle}>Dashboard</Text>
            <Text style={styles.headerSubtitle}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </FadeIn>

        {/* Net Worth Card */}
        <SlideUp delay={200}>
          <GlassCard gradient style={styles.netWorthCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Net Worth</Text>
              <View style={[styles.indicator, { backgroundColor: THEME.primary }]}>
                <Text style={styles.indicatorText}>
                  {netWorth.usd >= 0 ? '↑' : '↓'}
                </Text>
              </View>
            </View>
            <Text style={styles.primaryAmount}>
              {formatCurrency(animatedValues.netWorth, 'USD')}
            </Text>
            <Text style={styles.secondaryAmount}>
              {formatCurrency(animatedValues.netWorth * 1500, 'IQD')}
            </Text>
            <View style={styles.netWorthChart}>
              <View style={[styles.chartBar, { width: `${Math.min(Math.abs(netWorth.usd) / 10, 100)}%` }]} />
            </View>
          </GlassCard>
        </SlideUp>

        {/* Revenue Card */}
        <SlideUp delay={300}>
          <GlassCard style={styles.revenueCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>This Month's Revenue</Text>
              <LinearGradient
                colors={THEME.gradients.income}
                style={styles.revenueIndicator}
              >
                <Text style={styles.revenueIndicatorText}>
                  {monthlyRevenue > 0 ? '↑' : '→'}
                </Text>
              </LinearGradient>
            </View>
            <Text style={styles.revenueAmount}>
              {formatCurrency(animatedValues.revenue, 'USD')}
            </Text>
            <View style={styles.revenueBreakdown}>
              <Text style={styles.revenueText}>
                KUBER + Nutrify
              </Text>
            </View>
          </GlassCard>
        </SlideUp>

        {/* Recent Activity */}
        <SlideUp delay={400}>
          <GlassCard style={styles.activityCard}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Recent Activity</Text>
              <Text style={styles.activityCount}>
                {recentTransactions.length} transactions
              </Text>
            </View>
            {recentTransactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💳</Text>
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubtext}>Add your first transaction to get started</Text>
              </View>
            ) : (
              <View style={styles.transactionsList}>
                {recentTransactions.map((transaction, index) => (
                  <FadeIn key={transaction.id} delay={500 + index * 100}>
                    <AnimatedButton
                      style={styles.transactionItem}
                      onPress={() => { }} // Add navigation to transaction details
                    >
                      <View style={styles.transactionLeft}>
                        <View
                          style={[
                            styles.transactionIcon,
                            { backgroundColor: getTransactionColor(transaction.category, transaction.type) + '20' }
                          ]}
                        >
                          <Text
                            style={[
                              styles.transactionIconText,
                              { color: getTransactionColor(transaction.category, transaction.type) }
                            ]}
                          >
                            {transaction.category.charAt(0).toUpperCase()}
                          </Text>
                        </View>
                        <View style={styles.transactionInfo}>
                          <Text style={styles.transactionCategory}>
                            {transaction.category.charAt(0).toUpperCase() + transaction.category.slice(1)}
                          </Text>
                          <Text style={styles.transactionDescription}>
                            {transaction.description}
                          </Text>
                        </View>
                      </View>
                      <Text style={[
                        styles.transactionAmount,
                        { color: transaction.type === 'income' ? THEME.primary : THEME.danger }
                      ]}>
                        {transaction.type === 'income' ? '+' : '-'}
                        {formatCurrency(transaction.amount, transaction.currency)}
                      </Text>
                    </AnimatedButton>
                  </FadeIn>
                ))}
              </View>
            )}
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
  cardTitle: {
    color: THEME.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
  indicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorText: {
    color: THEME.background,
    fontSize: 12,
    fontWeight: 'bold',
  },
  netWorthCard: {
    ...THEME.shadow.large,
  },
  primaryAmount: {
    color: THEME.text,
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  secondaryAmount: {
    color: THEME.textSecondary,
    fontSize: 18,
    marginBottom: THEME.spacing.md,
  },
  netWorthChart: {
    height: 4,
    backgroundColor: THEME.glass.border,
    borderRadius: 2,
    overflow: 'hidden',
  },
  chartBar: {
    height: '100%',
    backgroundColor: THEME.primary,
    borderRadius: 2,
  },
  revenueCard: {
    ...THEME.shadow.medium,
  },
  revenueIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  revenueIndicatorText: {
    color: THEME.text,
    fontSize: 12,
    fontWeight: 'bold',
  },
  revenueAmount: {
    color: THEME.primary,
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: THEME.spacing.xs,
  },
  revenueBreakdown: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  revenueText: {
    color: THEME.textSecondary,
    fontSize: 14,
  },
  activityCard: {
    ...THEME.shadow.medium,
  },
  activityCount: {
    color: THEME.textSecondary,
    fontSize: 12,
    backgroundColor: THEME.glass.background,
    paddingHorizontal: THEME.spacing.sm,
    paddingVertical: THEME.spacing.xs,
    borderRadius: 8,
  },
  emptyState: {
    alignItems: 'center',
    padding: THEME.spacing.xl,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: THEME.spacing.md,
  },
  emptyText: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '500',
    marginBottom: THEME.spacing.xs,
  },
  emptySubtext: {
    color: THEME.textSecondary,
    fontSize: 14,
    textAlign: 'center',
  },
  transactionsList: {
    gap: THEME.spacing.sm,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: THEME.spacing.md,
    backgroundColor: THEME.glass.background,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: THEME.glass.border,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: THEME.spacing.md,
  },
  transactionIconText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionInfo: {
    flex: 1,
  },
  transactionCategory: {
    color: THEME.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: THEME.spacing.xs / 2,
  },
  transactionDescription: {
    color: THEME.textSecondary,
    fontSize: 14,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});