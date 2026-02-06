import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Platform } from 'react-native';
import { useFinance } from '@/contexts/FinanceContext';
import { THEME } from '@/constants/finance';
import { GlassCard } from '@/components/GlassCard';
import { FadeIn, SlideUp } from '@/components/Animations';
import { PremiumBackground } from '@/components/PremiumBackground';
import { IconSymbol } from '@/components/ui/icon-symbol';

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
    <View style={styles.container}>
      <PremiumBackground />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { paddingBottom: 120 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <FadeIn delay={100}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>FluX</Text>
            <Text style={styles.headerSubtitle}>
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
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
              <View style={[styles.indicator, { backgroundColor: THEME.primaryGlow }]}>
                <Text style={[styles.indicatorText, { color: THEME.primary }]}>
                  {netWorth.usd >= 0 ? '↑' : '↓'}
                </Text>
              </View>
            </View>
            <Text style={styles.primaryAmount}>
              {formatCurrency(animatedValues.netWorth, 'USD')}
            </Text>
            <Text style={styles.secondaryAmount}>
              {formatCurrency(Math.abs(netWorth.iqd), 'IQD')}
            </Text>
          </GlassCard>
        </SlideUp>

        {/* Revenue Card */}
        <SlideUp delay={300}>
          <View style={styles.row}>
            <GlassCard style={styles.halfCard}>
              <Text style={styles.cardTitle}>App Revenue</Text>
              <Text style={styles.statAmount}>
                {formatCurrency(animatedValues.revenue, 'USD')}
              </Text>
              <Text style={styles.revenueText}>This Month</Text>
            </GlassCard>

            <GlassCard style={styles.halfCard}>
              <Text style={styles.cardTitle}>Profit Margin</Text>
              <Text style={[styles.statAmount, { color: THEME.primary }]}>+24%</Text>
              <Text style={styles.revenueText}>vs last month</Text>
            </GlassCard>
          </View>
        </SlideUp>

        {/* Recent Activity */}
        <SlideUp delay={400}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCount}>
              <Text style={styles.activityCountText}>{recentTransactions.length}</Text>
            </View>
          </View>

          <View style={styles.transactionsList}>
            {recentTransactions.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyIcon}>💸</Text>
                <Text style={styles.emptyText}>No transactions yet</Text>
                <Text style={styles.emptySubtext}>Tap + to add one</Text>
              </View>
            ) : (
              recentTransactions.map((t, i) => (
                <View key={t.id} style={styles.transactionItem}>
                  <View style={styles.transactionLeft}>
                    <View style={[styles.transactionIcon, { backgroundColor: getTransactionColor(t.category, t.type) + '20' }]}>
                      <Text style={{ fontSize: 20 }}>
                        {t.type === 'income' ? '↓' : '↑'}
                      </Text>
                    </View>
                    <View style={styles.transactionInfo}>
                      <Text style={styles.transactionCategory}>{t.description || t.category}</Text>
                      <Text style={styles.transactionDescription}>
                        {new Date(t.date).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                  <Text style={[styles.transactionAmount, { color: t.type === 'income' ? THEME.primary : THEME.danger }]}>
                    {t.type === 'income' ? '+' : '-'}{formatCurrency(t.amount, t.currency)}
                  </Text>
                </View>
              ))
            )}
          </View>
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
  },
  header: {
    marginBottom: THEME.spacing.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: THEME.text,
    letterSpacing: -1,
  },
  headerSubtitle: {
    fontSize: 14,
    color: THEME.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  netWorthCard: {
    marginBottom: THEME.spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: THEME.spacing.sm,
  },
  cardTitle: {
    fontSize: 14,
    color: THEME.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '600',
  },
  indicator: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  indicatorText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  primaryAmount: {
    fontSize: 42,
    fontWeight: '800',
    color: THEME.text,
    letterSpacing: -1,
    marginBottom: 4,
  },
  secondaryAmount: {
    fontSize: 18,
    color: THEME.textSecondary,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    gap: THEME.spacing.md,
    marginBottom: THEME.spacing.xl,
  },
  halfCard: {
    flex: 1,
  },
  statAmount: {
    fontSize: 24,
    fontWeight: '700',
    color: THEME.text,
    marginTop: THEME.spacing.sm,
    marginBottom: 2,
  },
  revenueText: {
    fontSize: 12,
    color: THEME.textMuted,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: THEME.spacing.md,
    gap: THEME.spacing.sm,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: THEME.text,
  },
  activityCount: {
    backgroundColor: THEME.glass.border,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  activityCountText: {
    color: THEME.textSecondary,
    fontSize: 12,
    fontWeight: 'bold',
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
    borderRadius: 16,
    borderWidth: 1,
    borderColor: THEME.glass.border,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: THEME.spacing.md,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  transactionInfo: {
    gap: 2,
  },
  transactionCategory: {
    fontSize: 16,
    fontWeight: '600',
    color: THEME.text,
  },
  transactionDescription: {
    fontSize: 12,
    color: THEME.textSecondary,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    padding: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: THEME.text,
    fontWeight: '600',
  },
  emptySubtext: {
    fontSize: 14,
    color: THEME.textSecondary,
  }
});