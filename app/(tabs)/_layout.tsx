
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)' as any,
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'meals',
      route: '/(tabs)/meals' as any,
      icon: 'restaurant',
      label: 'Meals',
    },
    {
      name: 'workouts',
      route: '/(tabs)/workouts' as any,
      icon: 'fitness-center',
      label: 'Workouts',
    },
    {
      name: 'progress',
      route: '/(tabs)/progress' as any,
      icon: 'bar-chart',
      label: 'Progress',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile' as any,
      icon: 'person',
      label: 'Profile',
    },
  ];

  return (
    <>
      <Tabs
        tabBar={() => <FloatingTabBar tabs={tabs} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="(home)" options={{ title: 'Home' }} />
        <Tabs.Screen name="meals" options={{ title: 'Meals' }} />
        <Tabs.Screen name="workouts" options={{ title: 'Workouts' }} />
        <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        <Tabs.Screen name="content-generator" options={{ href: null }} />
        <Tabs.Screen name="testing-guide" options={{ href: null }} />
      </Tabs>
    </>
  );
}
