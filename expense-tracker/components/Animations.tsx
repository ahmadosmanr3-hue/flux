import React from 'react';
import { Animated, TouchableOpacity, ViewStyle, StyleProp } from 'react-native';
import { THEME } from '@/constants/finance';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  scale?: number;
  opacity?: number;
  disabled?: boolean;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onPress,
  style,
  scale = 0.95,
  opacity = 0.8,
  disabled = false,
}) => {
  const animatedValue = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: scale,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: true,
      tension: 100,
      friction: 8,
    }).start();
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={opacity}
      disabled={disabled}
    >
      <Animated.View
        style={[
          style,
          {
            transform: [{ scale: animatedValue }],
          },
        ]}
      >
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

interface FadeInProps {
  children: React.ReactNode;
  duration?: number;
  delay?: number;
  style?: any;
}

export const FadeIn: React.FC<FadeInProps> = ({
  children,
  duration = THEME.animation.normal,
  delay = 0,
  style
}) => {
  const fadeAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};

interface SlideUpProps {
  children: React.ReactNode;
  distance?: number;
  duration?: number;
  delay?: number;
  style?: any;
}

export const SlideUp: React.FC<SlideUpProps> = ({
  children,
  distance = 50,
  duration = THEME.animation.normal,
  delay = 0,
  style
}) => {
  const slideAnim = React.useRef(new Animated.Value(distance)).current;

  React.useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: 0,
      duration,
      delay,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
};