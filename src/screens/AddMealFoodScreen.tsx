import tw from 'twrnc';
import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, Alert } from 'react-native';
import { Text, IconButton, Card, Searchbar, Portal, Dialog, TextInput, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDataStore, CustomFood } from '../store/useDataStore';
import { useTranslation } from 'react-i18next';
import ScannerModal from '../components/ScannerModal';

export default function AddMealFoodScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { date, mealId, mealName } = route.params;

  const { customFoods, logFoodToMeal, dailyLogs, removeFoodFromMeal } = useDataStore();
  const [searchQuery, setSearchQuery] = useState('');
  
  const [scannerVisible, setScannerVisible] = useState(false);

  // Portion Dialog State
  const [portionDialogVisible, setPortionDialogVisible] = useState(false);
  const [selectedFood, setSelectedFood] = useState<CustomFood | null>(null);
  const [portionInput, setPortionInput] = useState('1');

  // Items currently in this specific meal
  const currentMealItems = dailyLogs.find(l => l.date === date && l.mealId === mealId)?.items || [];

  const filteredFoods = customFoods.filter(f => 
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startAddFood = (food: CustomFood) => {
    setSelectedFood(food);
    setPortionInput('1');
    setPortionDialogVisible(true);
  };

  const confirmAddFood = () => {
    if (!selectedFood) return;
    const portions = parseFloat(portionInput);
    if (isNaN(portions) || portions <= 0) {
      Alert.alert(t('error'), t('numberError'));
      return;
    }

    const logItem = {
      id: Date.now().toString(),
      foodId: selectedFood.id,
      name: selectedFood.name,
      calories: Math.round(selectedFood.calories * portions),
      protein: Math.round(selectedFood.protein * portions),
      sugar: selectedFood.sugar ? Math.round(selectedFood.sugar * portions) : 0,
      portions,
      timestamp: new Date().toISOString()
    };
    
    logFoodToMeal(date, mealId, logItem);
    setPortionDialogVisible(false);
    setSelectedFood(null);
  };

  const handleBarcodeScan = (barcode: string) => {
    setScannerVisible(false);
    const foundFood = customFoods.find(f => f.barcode === barcode);
    if (foundFood) {
      setTimeout(() => startAddFood(foundFood), 500); // Wait for modal to close
    } else {
      Alert.alert(
        t('foodNotFound'),
        t('wantToCreateFood').replace('{code}', barcode),
        [
          { text: t('cancel'), style: 'cancel' },
          { text: t('yes'), onPress: () => navigation.navigate('CreateEditFood', { initialBarcode: barcode }) }
        ]
      );
    }
  };

  return (
    <View style={tw`flex-1 bg-zinc-50 dark:bg-zinc-900`}>
      <View style={tw`flex-row items-center justify-between p-4 mt-8 bg-white dark:bg-zinc-800`}>
        <View style={tw`flex-row items-center`}>
          <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
          <View>
            <Text variant="titleLarge" style={tw`font-bold text-zinc-800 dark:text-zinc-100`}>
              {mealName}
            </Text>
            <Text variant="bodySmall" style={tw`text-zinc-500`}>{date}</Text>
          </View>
        </View>
        <IconButton
          icon="barcode-scan"
          size={24}
          mode="contained-tonal"
          iconColor="#f97316"
          onPress={() => setScannerVisible(true)}
        />
      </View>

      <View style={tw`p-4 flex-1`}>
        {currentMealItems.length > 0 && (
          <View style={tw`mb-4`}>
            <Text variant="titleMedium" style={tw`mb-2 font-bold text-zinc-800 dark:text-zinc-100`}>{t('addedToMeal')}</Text>
            {currentMealItems.map(item => (
              <View key={item.id} style={tw`flex-row justify-between items-center py-2 border-b border-zinc-200 dark:border-zinc-700`}>
                <View>
                  <Text style={tw`text-zinc-800 dark:text-zinc-100 font-bold`}>{item.name} <Text style={tw`text-xs font-normal text-zinc-500`}>x{item.portions}</Text></Text>
                  <Text style={tw`text-zinc-500 text-xs`}>{item.calories} kcal • {item.protein}g P {item.sugar ? `• ${item.sugar}g Sugar` : ''}</Text>
                </View>
                <IconButton icon="minus-circle" size={20} iconColor="#ef4444" onPress={() => removeFoodFromMeal(date, mealId, item.id)} />
              </View>
            ))}
          </View>
        )}

        <Searchbar
          placeholder={t('searchFoods')}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={tw`mb-4 bg-white dark:bg-zinc-800`}
        />

        <FlatList
          data={filteredFoods}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <View style={tw`items-center justify-center py-10`}>
              <Text style={tw`text-zinc-500 mb-4`}>{t('noFoods')}</Text>
            </View>
          }
          ListFooterComponent={
            <TouchableOpacity 
              style={tw`mt-4 p-4 border border-dashed border-orange-500 rounded-lg items-center`}
              onPress={() => navigation.navigate('CreateEditFood')}
            >
              <Text style={tw`text-orange-500 font-bold`}>{t('createNewFood')}</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <Card style={tw`mb-2 bg-white dark:bg-zinc-800`} onPress={() => startAddFood(item)}>
              <Card.Content style={tw`flex-row justify-between items-center`}>
                <View>
                  <Text style={tw`font-bold text-zinc-800 dark:text-zinc-100`}>{item.name}</Text>
                  <Text style={tw`text-zinc-500`}>{item.calories} kcal • {item.protein}g P {item.weight ? `(${item.weight}g)` : ''}</Text>
                </View>
                <IconButton icon="plus-circle" size={24} iconColor="#3b82f6" onPress={() => startAddFood(item)} />
              </Card.Content>
            </Card>
          )}
        />
      </View>

      <ScannerModal
        visible={scannerVisible}
        onDismiss={() => setScannerVisible(false)}
        onScan={handleBarcodeScan}
      />

      <Portal>
        <Dialog visible={portionDialogVisible} onDismiss={() => setPortionDialogVisible(false)} style={tw`bg-white dark:bg-zinc-800`}>
          <Dialog.Title style={tw`text-zinc-900 dark:text-white`}>{selectedFood?.name}</Dialog.Title>
          <Dialog.Content>
            <Text style={tw`mb-4 text-zinc-600 dark:text-zinc-400`}>
              {t('howManyPortions').replace('{weight}', selectedFood?.weight ? `${selectedFood.weight}g` : '1 serving')}
            </Text>
            <TextInput
              label={t('portions')}
              value={portionInput}
              onChangeText={setPortionInput}
              keyboardType="numeric"
              mode="outlined"
              activeOutlineColor="#f97316"
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setPortionDialogVisible(false)}>{t('cancel')}</Button>
            <Button mode="contained" buttonColor="#f97316" onPress={confirmAddFood}>{t('add')}</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>

    </View>
  );
}
