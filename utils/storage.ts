import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  USER_ID: 'userId',
  FAVORITES: 'favorites',
  USER_DATA: 'userData',
  IS_GUEST: 'isGuest',
};

export const storage = {
  // User ID
  getUserId: async (): Promise<string | null> => {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
  },
  setUserId: async (id: string): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, id);
  },
  removeUserId: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
  },

  // Favorites
  getFavorites: async (): Promise<string[]> => {
    const favorites = await AsyncStorage.getItem(STORAGE_KEYS.FAVORITES);
    return favorites ? JSON.parse(favorites) : [];
  },
  setFavorites: async (favorites: string[]): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
  },

  // User Data
  getUserData: async (): Promise<any | null> => {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return data ? JSON.parse(data) : null;
  },
  setUserData: async (data: any): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data));
  },
  removeUserData: async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
  },

  // Guest Mode
  getIsGuest: async (): Promise<boolean> => {
    const isGuest = await AsyncStorage.getItem(STORAGE_KEYS.IS_GUEST);
    return isGuest !== null ? JSON.parse(isGuest) : true;
  },
  setIsGuest: async (isGuest: boolean): Promise<void> => {
    await AsyncStorage.setItem(STORAGE_KEYS.IS_GUEST, JSON.stringify(isGuest));
  },

  // Clear all data
  clearAll: async (): Promise<void> => {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.USER_ID,
      STORAGE_KEYS.FAVORITES,
      STORAGE_KEYS.USER_DATA,
      STORAGE_KEYS.IS_GUEST,
    ]);
  },
};
