import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CustomFood {
  id: string;
  name: string;
  calories: number;
  protein: number;
  weight?: number;
  sugar?: number;
  barcode?: string;
}

export interface MealLogItem {
  id: string;
  foodId: string; // references CustomFood.id
  name: string;   // copied at the time of logging
  calories: number;
  protein: number;
  sugar?: number;
  portions: number;
  timestamp: string; // ISO string
}

export interface DailyLog {
  date: string; // YYYY-MM-DD
  mealId: string; // e.g. "1" for Breakfast
  items: MealLogItem[];
}

interface DataState {
  customFoods: CustomFood[];
  dailyLogs: DailyLog[];

  addCustomFood: (food: Omit<CustomFood, 'id'>) => void;
  updateCustomFood: (id: string, food: Omit<CustomFood, 'id'>) => void;
  deleteCustomFood: (id: string) => void;

  logFoodToMeal: (date: string, mealId: string, food: MealLogItem) => void;
  removeFoodFromMeal: (date: string, mealId: string, logItemId: string) => void;

  clearAllData: () => void;
}

const initialFoods: CustomFood[] = [
  { id: 'f1', name: 'Pechuga de Pollo', weight: 100, sugar: 0, protein: 25, calories: 150 },
  { id: 'f2', name: 'Bife de Chorizo', weight: 100, sugar: 0, protein: 24, calories: 250 },
  { id: 'f3', name: 'Huevo Duro (unidad)', weight: 50, sugar: 0.6, protein: 6, calories: 78 },
  { id: 'f4', name: 'Arroz Blanco Cocido', weight: 100, sugar: 0.1, protein: 2.7, calories: 130 },
  { id: 'f5', name: 'Fideos al Huevo Cocidos', weight: 100, sugar: 0.5, protein: 5, calories: 158 },
  { id: 'f6', name: 'Leche Entera La Serenísima', weight: 200, sugar: 9.4, protein: 6, calories: 116, barcode: '7790742110101' },
  { id: 'f7', name: 'Yogur Natural', weight: 190, sugar: 9, protein: 7, calories: 120, barcode: '7790742336204' },
  { id: 'f8', name: 'Queso Tybo (feta)', weight: 20, sugar: 0.1, protein: 5, calories: 65 },
  { id: 'f9', name: 'Pan Francés (mignon)', weight: 50, sugar: 1, protein: 4.5, calories: 135 },
  { id: 'f10', name: 'Manzana Roja', weight: 150, sugar: 15, protein: 0.4, calories: 78 },
  { id: 'f11', name: 'Banana', weight: 120, sugar: 14, protein: 1.3, calories: 105 },
  { id: 'f12', name: 'Papa Hervida', weight: 100, sugar: 0.8, protein: 2, calories: 87 },
  { id: 'f13', name: 'Lentejas Cocidas', weight: 100, sugar: 1.8, protein: 9, calories: 116 },
  { id: 'f14', name: 'Atún al Natural (lata)', weight: 120, sugar: 0, protein: 28, calories: 120, barcode: '7790520005121' },
  { id: 'f15', name: 'Avena Arrollada', weight: 30, sugar: 0.3, protein: 4, calories: 115, barcode: '7792180005315' },
  { id: 'f16', name: 'Manteca', weight: 10, sugar: 0.1, protein: 0.1, calories: 72 },
  { id: 'f17', name: 'Aceite de Girasol', weight: 10, sugar: 0, protein: 0, calories: 88 },
  { id: 'f18', name: 'Tarta J&Q (porción)', weight: 150, sugar: 2, protein: 12, calories: 380 },
  { id: 'f19', name: 'Milanesa de Carne (frita)', weight: 100, sugar: 1, protein: 18, calories: 280 },
  { id: 'f20', name: 'Yerba Mate (cebada)', weight: 50, sugar: 0, protein: 0, calories: 0 },
];

export const useDataStore = create<DataState>()(
  persist(
    (set) => ({
      customFoods: initialFoods,
      dailyLogs: [],

      addCustomFood: (food) =>
        set((state) => ({
          customFoods: [
            ...state.customFoods,
            { ...food, id: Date.now().toString() },
          ],
        })),

      updateCustomFood: (id, food) =>
        set((state) => ({
          customFoods: state.customFoods.map((f) =>
            f.id === id ? { ...f, ...food } : f
          ),
        })),

      deleteCustomFood: (id) =>
        set((state) => ({
          customFoods: state.customFoods.filter((f) => f.id !== id),
          // Note: we could remove it from logs, but usually we just keep the logged item since we copy properties
        })),

      logFoodToMeal: (date, mealId, food) =>
        set((state) => {
          const newLogs = [...state.dailyLogs];
          const logIndex = newLogs.findIndex(
            (log) => log.date === date && log.mealId === mealId
          );

          if (logIndex >= 0) {
            newLogs[logIndex].items.push(food);
          } else {
            newLogs.push({ date, mealId, items: [food] });
          }

          return { dailyLogs: newLogs };
        }),

      removeFoodFromMeal: (date, mealId, logItemId) =>
        set((state) => {
          const newLogs = state.dailyLogs.map((log) => {
            if (log.date === date && log.mealId === mealId) {
              return {
                ...log,
                items: log.items.filter((item) => item.id !== logItemId),
              };
            }
            return log;
          });
          return { dailyLogs: newLogs };
        }),

      clearAllData: () => set({ customFoods: initialFoods, dailyLogs: [] }),
    }),
    {
      name: 'protein-calories-data',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
