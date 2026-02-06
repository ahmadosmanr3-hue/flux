import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '@/constants/finance';

interface GlassCardProps {
  children: React.ReactNode;
  style?: any;
  opacity?: number;
  bordered?: boolean;
  gradient?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  style,
  opacity = 0.05,
  bordered = true,
  gradient = false
}) => {
  if (gradient) {
    return (
      <LinearGradient
        colors={THEME.gradients.glassActive}
        style={[styles.glassCard, style]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {children}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.glassCard,
        {
          backgroundColor: THEME.glass.background,
          borderWidth: bordered ? 1 : 0,
          borderColor: THEME.glass.border,
        },
        style
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  glassCard: {
    borderRadius: 24, // More rounded for modern look
    padding: 24, // More breathing room
    borderStyle: 'solid',
    ...Platform.select({
      web: {
        backdropFilter: THEME.glass.backdrop, // Web blur support
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)', // Premium soft shadow
      },
      default: {
        // Fallback for native
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
      },
    }),
  },
});