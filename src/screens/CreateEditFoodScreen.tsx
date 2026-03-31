import tw from 'twrnc';
import React, { useState, useEffect } from 'react';
import { View, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { TextInput, Button, IconButton, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useDataStore } from '../store/useDataStore';
import { useTranslation } from 'react-i18next';
import ScannerModal from '../components/ScannerModal';

export default function CreateEditFoodScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const route = useRoute<any>();
  const foodId = route.params?.foodId;
  const initialBarcode = route.params?.initialBarcode || '';

  const { customFoods, addCustomFood, updateCustomFood } = useDataStore();

  const [name, setName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [weight, setWeight] = useState('');
  const [sugar, setSugar] = useState('');
  const [barcode, setBarcode] = useState(initialBarcode);

  const [scannerVisible, setScannerVisible] = useState(false);

  useEffect(() => {
    if (foodId) {
      const existing = customFoods.find(f => f.id === foodId);
      if (existing) {
        setName(existing.name);
        setCalories(existing.calories.toString());
        setProtein(existing.protein.toString());
        if (existing.weight !== undefined) setWeight(existing.weight.toString());
        if (existing.sugar !== undefined) setSugar(existing.sugar.toString());
        if (existing.barcode) setBarcode(existing.barcode);
      }
    }
  }, [foodId, customFoods]);

  const handleSave = () => {
    if (!name.trim() || !calories || !protein) {
      Alert.alert(t('error'), t('fillAllFields'));
      return;
    }

    const foodData = {
      name: name.trim(),
      calories: parseFloat(calories),
      protein: parseFloat(protein),
      weight: weight.trim() !== '' ? parseFloat(weight) : undefined,
      sugar: sugar.trim() !== '' ? parseFloat(sugar) : undefined,
      barcode: barcode.trim() || undefined
    };

    if (isNaN(foodData.calories) || isNaN(foodData.protein) || (weight && isNaN(foodData.weight as number)) || (sugar && isNaN(foodData.sugar as number))) {
      Alert.alert(t('error'), t('numberError'));
      return;
    }

    if (foodId) {
      updateCustomFood(foodId, foodData as any);
    } else {
      addCustomFood(foodData as any);
    }

    navigation.goBack();
  };

  const handleBarcodeScan = (code: string) => {
    setScannerVisible(false);
    setBarcode(code);
  };

  return (
    <KeyboardAvoidingView 
      style={tw`flex-1 bg-white dark:bg-zinc-900`} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={tw`flex-row items-center p-4 mt-8`}>
        <IconButton icon="arrow-left" size={24} onPress={() => navigation.goBack()} />
        <Text variant="titleLarge" style={tw`font-bold text-zinc-800 dark:text-zinc-100`}>
          {foodId ? t('editFood') : t('createCustomFood')}
        </Text>
      </View>

      <ScrollView contentContainerStyle={tw`p-4`} keyboardShouldPersistTaps="handled">
        <TextInput
          label={t('foodName')}
          value={name}
          onChangeText={setName}
          style={tw`mb-4`}
          mode="outlined"
          activeOutlineColor="#f97316"
        />

        <TextInput
          label={t('calories') + ' (kcal)'}
          value={calories}
          onChangeText={setCalories}
          keyboardType="numeric"
          style={tw`mb-4`}
          mode="outlined"
          activeOutlineColor="#f97316"
        />

        <TextInput
          label={t('protein') + ' (g)'}
          value={protein}
          onChangeText={setProtein}
          keyboardType="numeric"
          style={tw`mb-4`}
          mode="outlined"
          activeOutlineColor="#3b82f6"
        />

        <View style={tw`flex-row justify-between mb-4`}>
          <TextInput
            label={t('weight')}
            value={weight}
            onChangeText={setWeight}
            keyboardType="numeric"
            style={tw`flex-1 mr-2`}
            mode="outlined"
            activeOutlineColor="#eab308"
          />
          <TextInput
            label={t('sugar')}
            value={sugar}
            onChangeText={setSugar}
            keyboardType="numeric"
            style={tw`flex-1 ml-2`}
            mode="outlined"
            activeOutlineColor="#ef4444"
          />
        </View>

        <TextInput
          label={t('barcode')}
          value={barcode}
          onChangeText={setBarcode}
          keyboardType="default"
          style={tw`mb-8`}
          mode="outlined"
          activeOutlineColor="#8b5cf6"
          right={<TextInput.Icon icon="barcode-scan" onPress={() => setScannerVisible(true)} />}
        />

        <Button 
          mode="contained" 
          onPress={handleSave}
          style={tw`py-2 bg-orange-500`}
          contentStyle={{ height: 50 }}
        >
          {foodId ? t('updateFood') : t('saveFood')}
        </Button>
      </ScrollView>

      <ScannerModal
        visible={scannerVisible}
        onDismiss={() => setScannerVisible(false)}
        onScan={handleBarcodeScan}
      />
    </KeyboardAvoidingView>
  );
}
