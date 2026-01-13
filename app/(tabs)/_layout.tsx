
import FloatingTabBar from '@/components/FloatingTabBar';
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <>
      <Tabs
        tabBar={(props) => (
          <FloatingTabBar
            tabs={[
              {
                route: '/(tabs)/(home)',
                label: 'Home',
                ios_icon_name: 'house.fill',
                android_material_icon_name: 'home',
              },
              {
                route: '/(tabs)/meals',
                label: 'Meals',
                ios_icon_name: 'fork.knife',
                android_material_icon_name: 'restaurant',
              },
              {
                route: '/(tabs)/workouts',
                label: 'Workouts',
                ios_icon_name: 'figure.run',
                android_material_icon_name: 'fitness-center',
              },
              {
                route: '/(tabs)/progress',
                label: 'Progress',
                ios_icon_name: 'chart.bar.fill',
                android_material_icon_name: 'show-chart',
              },
              {
                route: '/(tabs)/profile',
                label: 'Profile',
                ios_icon_name: 'person.fill',
                android_material_icon_name: 'person',
              },
            ]}
          />
        )}
      >
        <Tabs.Screen
          name="(home)"
          options={{
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="meals"
          options={{
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="workouts"
          options={{
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="progress"
          options={{
            headerShown: false,
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            headerShown: false,
          }}
        />
      </Tabs>
    </>
  );
}
