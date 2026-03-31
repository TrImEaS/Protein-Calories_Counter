// Web does NOT support expo-notifications, so we export no-op stubs
import { MealConfig } from '../store/useStore';

export async function requestNotificationPermissions(): Promise<boolean> {
  return false;
}

export async function scheduleMealReminders(_meals: MealConfig[]) {
  // no-op on web
}
