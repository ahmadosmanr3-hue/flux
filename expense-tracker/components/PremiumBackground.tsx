import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    withSequence,
    Easing
} from 'react-native-reanimated';
import { THEME } from '@/constants/finance';

const { width, height } = Dimensions.get('window');

export const PremiumBackground = () => {
    const blob1Opacity = useSharedValue(0.4);
    const blob2Opacity = useSharedValue(0.4);
    const blob3Opacity = useSharedValue(0.4);

    useEffect(() => {
        blob1Opacity.value = withRepeat(
            withSequence(
                withTiming(0.6, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.4, { duration: 3000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
        blob2Opacity.value = withRepeat(
            withSequence(
                withTiming(0.7, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                withTiming(0.4, { duration: 4000, easing: Easing.inOut(Easing.ease) })
            ),
            -1,
            true
        );
    }, []);

    const style1 = useAnimatedStyle(() => ({ opacity: blob1Opacity.value }));
    const style2 = useAnimatedStyle(() => ({ opacity: blob2Opacity.value }));

    return (
        <View style={StyleSheet.absoluteFill}>
            {/* Base Black */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: THEME.background }]} />

            {/* Ambient Glow 1 - Top Left (Primary) */}
            <Animated.View style={[styles.blob1, style1]}>
                <LinearGradient
                    colors={[THEME.primaryGlow, 'transparent']}
                    style={styles.gradient}
                    start={{ x: 0.2, y: 0.2 }}
                    end={{ x: 0.8, y: 0.8 }}
                />
            </Animated.View>

            {/* Ambient Glow 2 - Bottom Right (Danger/Accent) */}
            <Animated.View style={[styles.blob2, style2]}>
                <LinearGradient
                    colors={[THEME.dangerGlow, 'transparent']}
                    style={styles.gradient}
                    start={{ x: 0.8, y: 0.8 }}
                    end={{ x: 0.2, y: 0.2 }}
                />
            </Animated.View>

            {/* Noise Texture Overlay (Optional, simulated with low opacity) */}
            <View style={[StyleSheet.absoluteFill, { backgroundColor: 'transparent' }]} />
        </View>
    );
};

const styles = StyleSheet.create({
    blob1: {
        position: 'absolute',
        top: -height * 0.2,
        left: -width * 0.2,
        width: width * 1.2,
        height: height * 0.6,
        borderRadius: width,
        transform: [{ scale: 1.2 }],
    },
    blob2: {
        position: 'absolute',
        bottom: -height * 0.2,
        right: -width * 0.2,
        width: width * 1.2,
        height: height * 0.6,
        borderRadius: width,
        transform: [{ scale: 1.2 }],
    },
    gradient: {
        flex: 1,
        borderRadius: width,
    }
});
