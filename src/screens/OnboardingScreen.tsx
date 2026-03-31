import tw from 'twrnc';
import React, { useState } from 'react';
import { View, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { Text, TextInput, Button, useTheme } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const setGoals = useStore(state => state.setGoals);
  const completeOnboarding = useStore(state => state.completeOnboarding);

  const [calories, setCalories] = useState('2000');
  const [protein, setProtein] = useState('150');

  const handleComplete = () => {
    const cal = parseInt(calories, 10);
    const pro = parseInt(protein, 10);
    if (!isNaN(cal) && !isNaN(pro)) {
      setGoals(cal, pro);
      completeOnboarding();
    }
  };

  return (
    <KeyboardAvoidingView 
      style={tw`flex-1 bg-white dark:bg-zinc-900`} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
        <Text variant="headlineLarge" style={tw`font-bold text-center mb-6 text-zinc-900 dark:text-white`} accessibilityRole="header">
          {t('welcome')}
        </Text>
        
        <Text variant="bodyLarge" style={tw`text-center mb-8 text-zinc-600 dark:text-zinc-300`}>
          Set your daily goals to get started. You can always change this later in settings.
        </Text>

        <TextInput
          label={t('calories')}
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          style={tw`mb-4`}
          mode="outlined"
          accessibilityLabel="Daily Calorie Goal Input"
        />

        <TextInput
          label={t('protein') + " (g)"}
          value={protein}
          onChangeText={setProtein}
          keyboardType="numeric"
          style={tw`mb-8`}
          mode="outlined"
          accessibilityLabel="Daily Protein Goal Input"
        />

        <Button 
          mode="contained" 
          onPress={handleComplete}
          style={tw`py-2`}
          contentStyle={{ height: 50 }}
          accessibilityRole="button"
        >
          Continue
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
