import * as Location from 'expo-location';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

export interface LocationData {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
  address?: string;
}

interface LocationContextType {
  location: LocationData | null;
  isLoading: boolean;
  error: string | null;
  requestPermission: () => Promise<boolean>;
  getCurrentLocation: () => Promise<void>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

// Default location (Delhi)
const DEFAULT_LOCATION: LocationData = {
  latitude: 28.6139,
  longitude: 77.2090,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      console.log('[Location] Initializing location...');
      // Check if permission is already granted
      const { status } = await Location.getForegroundPermissionsAsync();
      console.log('[Location] Current permission status:', status);
      
      if (status === 'granted') {
        console.log('[Location] Permission already granted, getting current location...');
        await getCurrentLocation();
      } else {
        console.log('[Location] Permission not granted, using default location');
        // Use default location
        setLocation(DEFAULT_LOCATION);
        setIsLoading(false);
      }
    } catch (err) {
      console.error('[Location] Error initializing location:', err);
      setLocation(DEFAULT_LOCATION);
      setIsLoading(false);
    }
  };

  const requestPermission = async (): Promise<boolean> => {
    try {
      console.log('[Location] Requesting location permission...');
      setError(null);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      console.log('[Location] Permission request result:', status);
      
      if (status === 'granted') {
        console.log('[Location] Permission granted, fetching location...');
        await getCurrentLocation();
        return true;
      } else {
        console.warn('[Location] Permission denied, using default location');
        setError('Location permission denied. Using default location.');
        setLocation(DEFAULT_LOCATION);
        return false;
      }
    } catch (err) {
      console.error('[Location] Error requesting permission:', err);
      const message = err instanceof Error ? err.message : 'Failed to request location permission';
      setError(message);
      return false;
    }
  };

  const getCurrentLocation = async () => {
    try {
      console.log('[Location] Getting current position...');
      setIsLoading(true);
      setError(null);

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      console.log('[Location] Position received:', {
        lat: currentLocation.coords.latitude,
        lng: currentLocation.coords.longitude,
        accuracy: currentLocation.coords.accuracy,
      });

      // Get address from coordinates
      let address: string | undefined;
      try {
        console.log('[Location] Reverse geocoding...');
        const addressPromise = Location.reverseGeocodeAsync({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
        });
        
        const timeoutPromise = new Promise<null>((resolve) =>
          setTimeout(() => resolve(null), 3000)
        );
        
        const addressResult = await Promise.race([addressPromise, timeoutPromise]);
        
        if (addressResult && Array.isArray(addressResult) && addressResult.length > 0) {
          const result = addressResult[0];
          console.log('[Location] Address result:', result);
          address = [
            result.street,
            result.city,
            result.region,
          ]
            .filter(Boolean)
            .join(', ');
          console.log('[Location] Formatted address:', address);
        } else {
          console.log('[Location] No address result or timeout');
        }
      } catch (err) {
        // Silently fail - address is optional
        console.warn('[Location] Could not get address, using coordinates only:', err);
      }

      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
        address,
      };
      
      console.log('[Location] Setting location state:', newLocation);
      setLocation(newLocation);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to get current location';
      console.error('[Location] Error getting location:', message, err);
      setError(message);
      console.log('[Location] Falling back to default location');
      setLocation(DEFAULT_LOCATION);
    } finally {
      console.log('[Location] Setting isLoading to false');
      setIsLoading(false);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        location,
        isLoading,
        error,
        requestPermission,
        getCurrentLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationContextType {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
