import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';
import { DashboardScreen } from '../features/artisan/screens/DashboardScreen';
import { ProfileScreen } from '../features/artisan/screens/ProfileScreen';
import { AIStudioScreen } from '../features/ai-studio/screens/AIStudioScreen';
import { CatalogScreen } from '../features/catalog/screens/CatalogScreen';
import { Colors } from '../constants/theme';

export type AppTabsParamList = {
  DashboardTab: undefined;
  AIStudioTab: undefined;
  CatalogTab: undefined;
  Profile: undefined;
};

const Tab = createBottomTabNavigator<AppTabsParamList>();

export const AppTabs: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
          shadowColor: 'transparent',
          elevation: 0,
          borderBottomWidth: 1,
          borderBottomColor: Colors.borderLight,
        },
        headerTitleStyle: {
          color: Colors.secondary,
          fontWeight: '600',
        },
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarStyle: {
          backgroundColor: Colors.surface,
          borderTopColor: Colors.borderLight,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={DashboardScreen}
        options={{
          title: 'Workshop',
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
        }}
      />

      <Tab.Screen
        name="AIStudioTab"
        component={AIStudioScreen}
        options={{
          title: 'AI Studio',
          tabBarLabel: 'AI Studio',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>✨</Text>,
        }}
      />

      <Tab.Screen
        name="CatalogTab"
        component={CatalogScreen}
        options={{
          title: 'Catalog & Inventory',
          tabBarLabel: 'Catalog',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📦</Text>,
        }}
      />

      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Artisan Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>👤</Text>,
        }}
      />
    </Tab.Navigator>
  );
};

