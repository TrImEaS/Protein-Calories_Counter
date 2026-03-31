import tw from 'twrnc';
import React, { useState, useMemo } from 'react';
import { View, ScrollView, Alert } from 'react-native';
import { Text, useTheme, IconButton, Card, Portal, Dialog, Button, TextInput } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useStore } from '../store/useStore';
import { useDataStore } from '../store/useDataStore';
import ProgressRing from '../components/ProgressRing';
import { useNavigation } from '@react-navigation/native';
import { scheduleMealReminders } from '../api/notifications';

export default function DashboardScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigation = useNavigation<any>();

  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [newMealName, setNewMealName] = useState('');
  const [newMealTime, setNewMealTime] = useState('');

  const { calorieGoal, proteinGoal, configuredMeals, updateMealConfig } = useStore();
  const { dailyLogs } = useDataStore();

  React.useEffect(() => {
    scheduleMealReminders(configuredMeals);
  }, [configuredMeals]);

  const currentLog = useMemo(() => {
    const logs = dailyLogs.filter(log => log.date === currentDate);
    return logs;
  }, [dailyLogs, currentDate]);

  const totalCalories = currentLog.reduce((acc, log) => {
    return acc + log.items.reduce((sum, item) => sum + item.calories, 0);
  }, 0);

  const totalProtein = currentLog.reduce((acc, log) => {
    return acc + log.items.reduce((sum, item) => sum + item.protein, 0);
  }, 0);

  const totalSugar = currentLog.reduce((acc, log) => {
    return acc + log.items.reduce((sum, item) => sum + (item.sugar || 0), 0);
  }, 0);

  const changeDate = (days: number) => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + days);
    setCurrentDate(d.toISOString().split('T')[0]);
  };

  const handleAddMeal = () => {
    if (newMealName.trim() === '' || newMealTime.trim() === '') return;
    
    updateMealConfig([
      ...configuredMeals,
      { id: Date.now().toString(), name: newMealName, defaultTime: newMealTime }
    ]);
    
    setDialogVisible(false);
    setNewMealName('');
    setNewMealTime('');
  };

  const handleDeleteMeal = (id: string) => {
    Alert.alert(
      t('deleteMeal'),
      t('deleteMealConfirm'),
      [
        { text: t('cancel'), style: 'cancel' },
        { 
          text: t('yes'), 
          style: 'destructive', 
          onPress: () => {
            updateMealConfig(configuredMeals.filter(m => m.id !== id));
          } 
        }
      ]
    );
  };

  const isDark = theme.dark;

  // Background and primary tinting logic (Vibrant design request)
  const bgRoot = isDark ? tw`bg-zinc-900` : tw`bg-slate-50`;
  const bgCard = isDark ? tw`bg-zinc-800` : tw`bg-white`;
  const textPrimary = isDark ? tw`text-white` : tw`text-slate-900`;
  const textMuted = isDark ? tw`text-zinc-400` : tw`text-slate-500`;

  return (
    <View style={[tw`flex-1`, bgRoot]}>
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* App Header */}
        <View style={tw`flex-row justify-between items-center mt-12 mb-2`}>
          <Text variant="headlineSmall" style={[tw`font-extrabold`, textPrimary]}>TriMeas</Text>
          <View style={tw`flex-row`}>
            <IconButton icon="calendar-month" iconColor={textPrimary.color?.toString()} size={24} onPress={() => navigation.navigate('History')} />
            <IconButton icon="food-apple" iconColor={textPrimary.color?.toString()} size={24} onPress={() => navigation.navigate('ManageFoods')} />
            <IconButton icon="cog" iconColor={textPrimary.color?.toString()} size={24} onPress={() => navigation.navigate('Settings')} />
          </View>
        </View>

        {/* Date Selector */}
        <View style={tw`flex-row justify-between items-center mb-6`}>
          <IconButton icon="chevron-left" size={24} onPress={() => changeDate(-1)} />
          <Text variant="titleLarge" style={[tw`font-bold`, textPrimary]}>
            {currentDate === new Date().toISOString().split('T')[0] ? t('today') : currentDate}
          </Text>
          <IconButton icon="chevron-right" size={24} onPress={() => changeDate(1)} disabled={currentDate === new Date().toISOString().split('T')[0]} />
        </View>

        {/* Progress Rings */}
        <View style={[tw`flex-row justify-around mb-8 p-4 rounded-3xl shadow-lg border-0`, isDark ? tw`bg-zinc-800` : tw`bg-white shadow-slate-200`]}>
          <View style={tw`items-center`}>
            <ProgressRing
              value={totalCalories}
              maxValue={calorieGoal}
              radius={60}
              strokeWidth={14}
              activeColor="#f97316"
              inactiveColor={isDark ? '#3f3f46' : '#f1f5f9'}
              title={t('calories')}
              titleColor={isDark ? '#a1a1aa' : '#64748b'}
              valueColor={isDark ? '#fff' : '#0f172a'}
            />
            <Text style={[tw`mt-3 font-semibold`, textMuted]}>{totalCalories} / {calorieGoal} kcal</Text>
          </View>
          <View style={tw`items-center`}>
            <ProgressRing
              value={totalProtein}
              maxValue={proteinGoal}
              radius={60}
              strokeWidth={14}
              activeColor="#3b82f6"
              inactiveColor={isDark ? '#3f3f46' : '#f1f5f9'}
              title={t('protein')}
              titleColor={isDark ? '#a1a1aa' : '#64748b'}
              valueColor={isDark ? '#fff' : '#0f172a'}
            />
            <Text style={[tw`mt-3 font-semibold`, textMuted]}>{totalProtein} / {proteinGoal} g</Text>
          </View>
        </View>

        {/* Sugar Daily Tracker */}
        <View style={tw`items-center mb-6`}>
          <Text style={[tw`font-bold text-lg`, textPrimary]}>{t('dailySugar')}: <Text style={tw`text-amber-500`}>{totalSugar}g</Text></Text>
        </View>

        {/* Meals List */}
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text variant="titleMedium" style={[tw`font-bold`, textPrimary]}>{t('dailyMeals')}</Text>
          <IconButton icon="plus" size={22} mode="contained" containerColor="#f97316" iconColor="#fff" onPress={() => setDialogVisible(true)} />
        </View>

        {configuredMeals.map((meal) => {
          const mealLog = currentLog.find(l => l.mealId === meal.id);
          const mealCals = mealLog?.items.reduce((s, i) => s + i.calories, 0) || 0;
          const mealPro = mealLog?.items.reduce((s, i) => s + i.protein, 0) || 0;

          return (
            <Card key={meal.id} mode="elevated" style={[tw`mb-4 rounded-2xl border-0 shadow-md`, bgCard]} onPress={() => navigation.navigate('AddMealFood', { date: currentDate, mealId: meal.id, mealName: meal.name })}>
              <Card.Content style={tw`flex-row justify-between items-center px-4 py-3`}>
                <View>
                  <Text variant="titleMedium" style={[tw`font-bold`, textPrimary]}>{meal.name}</Text>
                  <Text variant="bodySmall" style={textMuted}>{meal.defaultTime}</Text>
                </View>
                <View style={tw`items-end flex-row items-center`}>
                  <View style={tw`items-end mr-4`}>
                    <Text style={[tw`font-bold text-lg text-orange-500`]}>{mealCals} <Text style={tw`text-xs text-orange-400 font-normal`}>kcal</Text></Text>
                    <Text style={[tw`font-bold text-sm text-blue-500`]}>{mealPro}g <Text style={tw`text-xs text-blue-400 font-normal`}>P</Text></Text>
                  </View>
                  <IconButton icon="trash-can-outline" iconColor="#ef4444" size={20} onPress={() => handleDeleteMeal(meal.id)} />
                </View>
              </Card.Content>
            </Card>
          );
        })}
      </ScrollView>

      {/* Add Custom Meal Portal */}
      <Portal>
        <Dialog visible={isDialogVisible} onDismiss={() => setDialogVisible(false)} style={bgCard}>
          <Dialog.Title style={textPrimary}>{t('addMeal')}</Dialog.Title>
          <Dialog.Content>
            <TextInput
              label={t('mealName')}
              value={newMealName}
              onChangeText={setNewMealName}
              mode="outlined"
              style={tw`mb-4`}
              activeOutlineColor="#f97316"
            />
            <TextInput
              label={t('mealTime')}
              placeholder="15:30"
              value={newMealTime}
              onChangeText={setNewMealTime}
              mode="outlined"
              keyboardType="numbers-and-punctuation"
              activeOutlineColor="#f97316"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>{t('cancel')}</Button>
            <Button mode="contained" buttonColor="#f97316" onPress={handleAddMeal}>{t('add')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
}
