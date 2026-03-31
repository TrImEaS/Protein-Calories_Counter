import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { useStore } from '../store/useStore';

import OnboardingScreen from '../screens/OnboardingScreen';
import DashboardScreen from '../screens/DashboardScreen';

import ManageFoodsScreen from '../screens/ManageFoodsScreen';
import CreateEditFoodScreen from '../screens/CreateEditFoodScreen';
import AddMealFoodScreen from '../screens/AddMealFoodScreen';
import SettingsScreen from '../screens/SettingsScreen';
import HistoryScreen from '../screens/HistoryScreen';

import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const hasCompletedOnboarding = useStore(state => state.hasCompletedOnboarding);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!hasCompletedOnboarding ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={DashboardScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="ManageFoods" component={ManageFoodsScreen} />
            <Stack.Screen name="CreateEditFood" component={CreateEditFoodScreen} />
            <Stack.Screen name="AddMealFood" component={AddMealFoodScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
