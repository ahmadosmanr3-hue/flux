import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { THEME } from '@/constants/finance';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: THEME.primary,
        tabBarInactiveTintColor: THEME.textSecondary,
        tabBarStyle: {
          position: 'absolute',
          bottom: 20,
          left: 20,
          right: 20,
          height: 72,
          backgroundColor: 'transparent',
          borderRadius: 40,
          borderTopWidth: 0,
          elevation: 0,
          zIndex: 100, // Ensure it sits on top
          overflow: 'hidden', // Clip child content
          ...Platform.select({
            web: {
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5)',
            },
            default: {
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.5,
              shadowRadius: 20,
            },
          }),
        },
        tabBarBackground: () => (
          <LinearGradient
            colors={THEME.gradients.glass}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 40,
              borderWidth: 1,
              borderColor: THEME.glass.border,
              backgroundColor: 'rgba(20, 20, 20, 0.7)', // Fallback semi-transparent black
              ...Platform.select({
                web: {
                  backdropFilter: 'blur(30px)',
                },
              }),
            }}
          />
        ),
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarShowLabel: false, // Cleaner look without text
        tabBarItemStyle: {
          paddingVertical: 12,
          height: 72,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="house.fill"
              color={focused ? THEME.primary : THEME.textSecondary}
              style={focused ? {
                shadowColor: THEME.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 12,
              } : undefined}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ focused }) => (
            <LinearGradient
              colors={focused ? THEME.gradients.primary : ['rgba(255, 255, 255, 0.15)', 'rgba(255, 255, 255, 0.1)']}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 20, // Float slightly above
                ...Platform.select({
                  web: {
                    boxShadow: focused ? `0 4px 16px ${THEME.primaryGlow}` : 'none',
                  },
                  default: {
                    shadowColor: focused ? THEME.primary : '#000',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: focused ? 0.6 : 0.3,
                    shadowRadius: 8,
                    elevation: 10,
                  }
                })
              }}
            >
              <IconSymbol
                size={24}
                name="plus"
                color={focused ? '#000' : THEME.text} // Black icon on active green button
                weight="bold"
              />
            </LinearGradient>
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused }) => (
            <IconSymbol
              size={28}
              name="gearshape.fill"
              color={focused ? THEME.primary : THEME.textSecondary}
              style={focused ? {
                shadowColor: THEME.primary,
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 12,
              } : undefined}
            />
          ),
        }}
      />
    </Tabs>
  );
}
