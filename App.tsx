import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef } from 'react';
import RootNavigator from './src/navigation/RootNavigator';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './src/api/queryClient';
import i18n from './src/locales/i18n';
import tw, { useDeviceContext } from 'twrnc';
import { useStore } from './src/store/useStore';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { useColorScheme, LogBox } from 'react-native';
import * as Localization from 'expo-localization';

LogBox.ignoreLogs(['`expo-notifications` functionality is not fully supported']);

export default function App() {
  useDeviceContext(tw, { observeDeviceColorSchemeChanges: false, initialColorScheme: 'device' });

  const colorScheme = useColorScheme();
  const storedTheme = useStore(state => state.theme);
  const storedLanguage = useStore(state => state.language);

  const isDark = storedTheme === 'dark' || (storedTheme === 'system' && colorScheme === 'dark');

  // Set twrnc color scheme synchronously BEFORE render — no useEffect, no loop
  tw.setColorScheme(isDark ? 'dark' : 'light');

  // Language: only fire when storedLanguage actually changes
  const prevLang = useRef(storedLanguage);
  useEffect(() => {
    if (prevLang.current !== storedLanguage) {
      prevLang.current = storedLanguage;
    }
    const targetLang =
      storedLanguage === 'system'
        ? (Localization.getLocales()[0].languageCode ?? 'en')
        : storedLanguage;
    i18n.changeLanguage(targetLang);
  }, [storedLanguage]);

  const paperTheme = isDark ? MD3DarkTheme : MD3LightTheme;

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        <RootNavigator />
        <StatusBar style={isDark ? 'light' : 'dark'} backgroundColor={isDark ? '#18181b' : '#f8fafc'} />
      </PaperProvider>
    </QueryClientProvider>
  );
}
