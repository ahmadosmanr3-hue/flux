import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { THEME } from '@/constants/finance';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'medium',
  color = THEME.primary
}) => {
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
        easing: (value) => value, // Linear rotation
      })
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const getSize = () => {
    switch (size) {
      case 'small': return 20;
      case 'medium': return 30;
      case 'large': return 40;
      default: return 30;
    }
  };

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.spinner,
        {
          width: getSize(),
          height: getSize(),
          transform: [{ rotate: spin }],
        },
      ]}
    >
      <LinearGradient
        colors={[color, `${color}66`, `${color}33`]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
    </Animated.View>
  );
};

interface ShimmerProps {
  width?: number;
  height?: number;
  style?: any;
}

export const Shimmer: React.FC<ShimmerProps> = ({
  width = 100,
  height = 20,
  style
}) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.3, 1, 0.3],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          backgroundColor: THEME.glass.border,
          borderRadius: height / 4,
          opacity: shimmerOpacity,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  spinner: {
    borderWidth: 3,
    borderColor: THEME.glass.border,
    borderTopColor: THEME.primary,
    borderRadius: 50,
    borderStyle: 'solid',
  },
  gradient: {
    flex: 1,
    borderRadius: 50,
    opacity: 0.8,
  },
});