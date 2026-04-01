import tw from 'twrnc';
import React, { useMemo } from 'react';
import { View, FlatList } from 'react-native';
import { Text, IconButton, Card, ProgressBar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { useDataStore } from '../store/useDataStore';
import { useStore } from '../store/useStore';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { dailyLogs } = useDataStore();
  const { calorieGoal, proteinGoal } = useStore();

  const historyData = useMemo(() => {
    const grouped: Record<string, { cals: number, pro: number }> = {};
    
    dailyLogs.forEach(log => {
      if (!grouped[log.date]) grouped[log.date] = { cals: 0, pro: 0 };
      grouped[log.date].cals += log.items.reduce((s, i) => s + i.calories, 0);
      grouped[log.date].pro += log.items.reduce((s, i) => s + i.protein, 0);
    });

    return Object.keys(grouped).sort((a,b) => b.localeCompare(a)).map(date => {
      const data = grouped[date];
      const calPercent = Math.round((data.cals / calorieGoal) * 100);
      const proPercent = Math.round((data.pro / proteinGoal) * 100);

      return {
        date,
        calPercent,
        proPercent,
        cals: data.cals,
        pro: data.pro
      };
    });
  }, [dailyLogs, calorieGoal, proteinGoal]);

  return (
    <View style={tw`flex-1 bg-zinc-50 dark:bg-zinc-900`}>
      <View style={tw`flex-row items-center p-4 mt-8 bg-white dark:bg-zinc-800`}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={tw`font-bold text-zinc-800 dark:text-zinc-100`}>
          History & Tracking
        </Text>
      </View>

      <FlatList
        data={historyData}
        keyExtractor={item => item.date}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={tw`items-center justify-center py-10`}>
            <Text style={tw`text-zinc-500`}>No logs found yet. Start tracking meals!</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={tw`mb-4 bg-white dark:bg-zinc-800`}>
            <Card.Content>
              <Text variant="titleMedium" style={tw`font-bold mb-4 text-zinc-800 dark:text-zinc-100`}>{item.date}</Text>
              
              <View style={tw`mb-4`}>
                <View style={tw`flex-row justify-between mb-1`}>
                  <Text style={tw`text-zinc-600 dark:text-zinc-300`}>Calories</Text>
                  <Text style={tw`font-bold ${item.calPercent > 100 ? 'text-red-500' : 'text-orange-500'}`}>
                    {item.calPercent}% ({item.cals} / {calorieGoal})
                  </Text>
                </View>
                <ProgressBar progress={Math.min(item.calPercent / 100, 1)} color={item.calPercent > 100 ? '#ef4444' : '#f97316'} style={tw`h-2 rounded`} />
              </View>

              <View>
                <View style={tw`flex-row justify-between mb-1`}>
                  <Text style={tw`text-zinc-600 dark:text-zinc-300`}>Protein</Text>
                  <Text style={tw`font-bold ${item.proPercent >= 100 ? 'text-green-500' : 'text-blue-500'}`}>
                    {item.proPercent}% ({item.pro} / {proteinGoal})
                  </Text>
                </View>
                <ProgressBar progress={Math.min(item.proPercent / 100, 1)} color={item.proPercent >= 100 ? '#22c55e' : '#3b82f6'} style={tw`h-2 rounded`} />
              </View>
            </Card.Content>
          </Card>
        )}
      />
    </View>
  );
}
