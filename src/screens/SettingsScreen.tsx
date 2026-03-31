import tw from 'twrnc';
import React, { useState } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, TextInput, Button, IconButton, SegmentedButtons } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useStore, ThemeType } from '../store/useStore';
import { useDataStore } from '../store/useDataStore';
import { useNavigation } from '@react-navigation/native';
import * as Localization from 'expo-localization';

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();

  const { 
    calorieGoal, 
    proteinGoal, 
    setGoals, 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    resetAllData: resetSettings 
  } = useStore();

  const { clearAllData } = useDataStore();

  const [calInput, setCalInput] = useState(calorieGoal.toString());
  const [proInput, setProInput] = useState(proteinGoal.toString());

  const handleUpdateGoals = () => {
    const c = parseInt(calInput, 10);
    const p = parseInt(proInput, 10);
    if (!isNaN(c) && !isNaN(p)) {
      setGoals(c, p);
      Alert.alert('✅', t('updated'));
    }
  };

  const handleLangChange = (val: string) => {
    const lang = val as 'system' | 'en' | 'es';
    setLanguage(lang);
    if (lang === 'system') {
      const sysLang = Localization.getLocales()[0].languageCode ?? 'en';
      i18n.changeLanguage(sysLang);
    } else {
      i18n.changeLanguage(lang);
    }
  };

  const confirmResetData = () => {
    Alert.alert(
      t('resetData'),
      t('resetWarning'),
      [
        { text: t('cancel'), style: 'cancel' },
        { text: t('resetData'), style: 'destructive', onPress: () => {
            clearAllData();
            resetSettings();
          } 
        }
      ]
    );
  };

  return (
    <View style={tw`flex-1 bg-zinc-50 dark:bg-zinc-900`}>
      <View style={tw`flex-row items-center p-4 mt-8 bg-white dark:bg-zinc-800`}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={tw`font-bold text-zinc-800 dark:text-zinc-100`}>
          {t('settings')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text variant="titleMedium" style={tw`mb-4 font-bold text-zinc-800 dark:text-zinc-100`}>{t('goals')}</Text>
        
        <TextInput
          label={t('calories')}
          value={calInput}
          onChangeText={setCalInput}
          keyboardType="numeric"
          style={tw`mb-4`}
          mode="outlined"
          activeOutlineColor="#f97316"
        />
        
        <TextInput
          label={t('protein') + " (g)"}
          value={proInput}
          onChangeText={setProInput}
          keyboardType="numeric"
          style={tw`mb-4`}
          mode="outlined"
          activeOutlineColor="#3b82f6"
        />

        <Button mode="contained" onPress={handleUpdateGoals} style={tw`mb-8`} buttonColor="#3b82f6">
          {t('updateGoals')}
        </Button>

        <Text variant="titleMedium" style={tw`mb-4 font-bold text-zinc-800 dark:text-zinc-100`}>{t('theme')}</Text>
        <SegmentedButtons
          value={theme}
          onValueChange={(val) => setTheme(val as ThemeType)}
          buttons={[
            { value: 'system', label: t('system') },
            { value: 'light', label: t('light') },
            { value: 'dark', label: t('dark') },
          ]}
          style={{ marginBottom: 32 }}
        />

        <Text variant="titleMedium" style={tw`mb-4 font-bold text-zinc-800 dark:text-zinc-100`}>{t('language')}</Text>
        <SegmentedButtons
          value={language}
          onValueChange={handleLangChange}
          buttons={[
            { value: 'system', label: t('system') },
            { value: 'en', label: t('english') },
            { value: 'es', label: t('spanish') },
          ]}
          style={{ marginBottom: 32 }}
        />

        <Text variant="titleMedium" style={tw`mb-4 font-bold text-red-500 mt-4`}>⚠️ {t('dangerZone')}</Text>
        <Button mode="outlined" textColor="#ef4444" onPress={confirmResetData} style={tw`border-red-500`}>
          {t('resetData')}
        </Button>

      </ScrollView>
    </View>
  );
}
