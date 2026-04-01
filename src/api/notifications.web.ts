import { MealConfig } from '../store/useStore';

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function scheduleMealReminders(_meals: MealConfig[]) {
}
