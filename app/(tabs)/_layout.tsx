
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'meals',
      route: '/(tabs)/meals',
      icon: 'restaurant',
      label: 'Meals',
    },
    {
      name: 'workouts',
      route: '/(tabs)/workouts',
      icon: 'fitness-center',
      label: 'Workouts',
    },
    {
      name: 'progress',
      route: '/(tabs)/progress',
      icon: 'trending-up',
      label: 'Progress',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none',
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="meals" name="meals" />
        <Stack.Screen key="workouts" name="workouts" />
        <Stack.Screen key="progress" name="progress" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
