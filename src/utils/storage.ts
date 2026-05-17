import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorageItem = async (key: string, value: string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    console.error('Error saving data', e);
  }
};

export const getStorageItem = async (key: string) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (e) {
    console.error('Error reading data', e);
    return null;
  }
};

export const removeStorageItem = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error('Error removing data', e);
  }
};





