import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ThemeType = 'system' | 'light' | 'dark';

export interface MealConfig {
  id: string;
  name: string;
  defaultTime: string;
}

export interface UserSettings {
  calorieGoal: number;
  proteinGoal: number;
  theme: ThemeType;
  language: 'system' | 'en' | 'es';
  configuredMeals: MealConfig[];
  hasCompletedOnboarding: boolean;
}

interface AppState extends UserSettings {
  setGoals: (calories: number, protein: number) => void;
  setTheme: (theme: ThemeType) => void;
  setLanguage: (lang: 'system' | 'en' | 'es') => void;
  completeOnboarding: () => void;
  updateMealConfig: (meals: MealConfig[]) => void;
  resetAllData: () => void;
}

const defaultMeals: MealConfig[] = [
  { id: '1', name: 'Breakfast', defaultTime: '08:00' },
  { id: '2', name: 'Lunch', defaultTime: '13:00' },
  { id: '3', name: 'Snack', defaultTime: '17:00' },
  { id: '4', name: 'Dinner', defaultTime: '21:00' },
];

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      calorieGoal: 2000,
      proteinGoal: 150,
      theme: 'system',
      language: 'system',
      configuredMeals: defaultMeals,
      hasCompletedOnboarding: false,

      setGoals: (calories, protein) => set({ calorieGoal: calories, proteinGoal: protein }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      completeOnboarding: () => set({ hasCompletedOnboarding: true }),
      updateMealConfig: (meals) => set({ configuredMeals: meals }),
      resetAllData: () => set({
        calorieGoal: 2000,
        proteinGoal: 150,
        theme: 'system',
        language: 'system',
        configuredMeals: defaultMeals,
        hasCompletedOnboarding: false,
      }),
    }),
    {
      name: 'protein-calories-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
