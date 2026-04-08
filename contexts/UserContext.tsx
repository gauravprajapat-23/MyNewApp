import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { UserContextType } from '../types/user';
import { storage } from '../utils/storage';
import { loginOrCreateUser, addFavorite as addFavoriteApi, removeFavorite as removeFavoriteApi } from '../api';

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [isGuest, setIsGuest] = useState(true);
  const [userId, setUserId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  // Load user data from AsyncStorage on mount
  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const storedIsGuest = await storage.getIsGuest();
      const storedUserId = await storage.getUserId();
      const storedFavorites = await storage.getFavorites();

      setIsGuest(storedIsGuest);
      
      if (storedUserId) {
        setUserId(parseInt(storedUserId));
      }
      
      setFavorites(storedFavorites);
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const loginUser = async (phone: string, fullName: string, email?: string) => {
    try {
      const user = await loginOrCreateUser(phone, fullName, email);
      
      setUserId(user.id);
      setIsGuest(false);
      
      await storage.setUserId(user.id.toString());
      await storage.setIsGuest(false);
      await storage.setUserData(user);
      
      console.log('User logged in successfully:', user);
    } catch (error) {
      console.error('Error logging in user:', error);
      throw error;
    }
  };

  const logoutUser = async () => {
    try {
      setUserId(null);
      setIsGuest(true);
      setFavorites([]);
      
      await storage.clearAll();
      await storage.setIsGuest(true);
      
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  };

  const addFavorite = async (id: string) => {
    setFavorites(prev => [...prev, id]);
    await storage.setFavorites([...favorites, id]);
    
    // If logged in, sync with backend
    if (!isGuest && userId) {
      try {
        await addFavoriteApi(userId, parseInt(id));
      } catch (error) {
        console.error('Error adding favorite to backend:', error);
        // Don't rollback - keep local state
      }
    }
  };

  const removeFavorite = async (id: string) => {
    setFavorites(prev => prev.filter(favId => favId !== id));
    await storage.setFavorites(favorites.filter(favId => favId !== id));
    
    // If logged in, sync with backend
    if (!isGuest && userId) {
      try {
        await removeFavoriteApi(userId, parseInt(id));
      } catch (error) {
        console.error('Error removing favorite from backend:', error);
        // Don't rollback - keep local state
      }
    }
  };

  const isFavorite = (id: string) => {
    return favorites.includes(id);
  };

  const addToSearchHistory = (query: string) => {
    setSearchHistory(prev => {
      const newHistory = [query, ...prev.filter(h => h !== query)].slice(0, 10);
      return newHistory;
    });
  };

  return (
    <UserContext.Provider
      value={{
        isGuest,
        userId,
        favorites,
        addFavorite,
        removeFavorite,
        isFavorite,
        searchHistory,
        addToSearchHistory,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
