
import FloatingTabBar from '@/components/FloatingTabBar';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

export default function TabLayout() {
  const tabs = [
    {
      name: '(home)',
      title: 'Home',
      ios_icon_name: 'house.fill',
      android_material_icon_name: 'home',
    },
    {
      name: 'meals',
      title: 'Meals',
      ios_icon_name: 'fork.knife',
      android_material_icon_name: 'restaurant',
    },
    {
      name: 'workouts',
      title: 'Workouts',
      ios_icon_name: 'figure.run',
      android_material_icon_name: 'fitness-center',
    },
    {
      name: 'content-generator',
      title: 'AI Content',
      ios_icon_name: 'sparkles',
      android_material_icon_name: 'auto-awesome',
    },
    {
      name: 'progress',
      title: 'Progress',
      ios_icon_name: 'chart.bar.fill',
      android_material_icon_name: 'bar-chart',
    },
    {
      name: 'profile',
      title: 'Profile',
      ios_icon_name: 'person.fill',
      android_material_icon_name: 'person',
    },
  ];

  return (
    <>
      <Tabs
        tabBar={(props) => <FloatingTabBar {...props} tabs={tabs} />}
        screenOptions={{
          headerShown: false,
        }}
      >
        <Tabs.Screen name="(home)" options={{ title: 'Home' }} />
        <Tabs.Screen name="meals" options={{ title: 'Meals' }} />
        <Tabs.Screen name="workouts" options={{ title: 'Workouts' }} />
        <Tabs.Screen name="content-generator" options={{ title: 'AI Content' }} />
        <Tabs.Screen name="progress" options={{ title: 'Progress' }} />
        <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
        <Tabs.Screen name="testing-guide" options={{ href: null }} />
      </Tabs>
    </>
  );
}
