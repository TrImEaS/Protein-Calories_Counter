import tw from 'twrnc';
import React from 'react';
import { View, FlatList, Alert } from 'react-native';
import { Text, IconButton, Card, FAB } from 'react-native-paper';
import { useTranslation } from 'react-i18next';
import { useDataStore } from '../store/useDataStore';
import { useNavigation } from '@react-navigation/native';

export default function ManageFoodsScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const { customFoods, deleteCustomFood } = useDataStore();

  const confirmDelete = (id: string, name: string) => {
    Alert.alert(
      "Delete Food",
      `Are you sure you want to delete ${name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deleteCustomFood(id) }
      ]
    );
  };

  return (
    <View style={tw`flex-1 bg-zinc-50 dark:bg-zinc-900`}>
      <View style={tw`flex-row items-center p-4 mt-8`}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={tw`font-bold text-zinc-800 dark:text-zinc-100`}>
          Manage Custom Foods
        </Text>
      </View>

      <FlatList
        data={customFoods}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={
          <View style={tw`items-center justify-center py-10`}>
            <Text style={tw`text-zinc-500`}>No custom foods created yet.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Card style={tw`mb-4 bg-white dark:bg-zinc-800`}>
            <Card.Content style={tw`flex-row justify-between items-center`}>
              <View style={tw`flex-1`}>
                <Text variant="titleMedium" style={tw`font-bold text-zinc-800 dark:text-zinc-100`}>
                  {item.name}
                </Text>
                <Text variant="bodyMedium" style={tw`text-zinc-500`}>
                  {item.calories} kcal • {item.protein}g protein
                </Text>
              </View>
              <View style={tw`flex-row`}>
                <IconButton 
                  icon="pencil" 
                  size={20} 
                  iconColor="#3b82f6"
                  onPress={() => navigation.navigate('CreateEditFood', { foodId: item.id })} 
                />
                <IconButton 
                  icon="delete" 
                  size={20} 
                  iconColor="#ef4444"
                  onPress={() => confirmDelete(item.id, item.name)} 
                />
              </View>
            </Card.Content>
          </Card>
        )}
      />

      <FAB
        icon="plus"
        style={tw`absolute bottom-8 right-8 bg-orange-500`}
        color="white"
        onPress={() => navigation.navigate('CreateEditFood')}
      />
    </View>
  );
}
