import { Stack } from 'expo-router';
import { ThemeProvider } from '../contexts/ThemeContext';
import { UserProvider } from '../contexts/UserContext';
import { LocationProvider } from '../contexts/LocationContext';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate font loading - in production, load actual fonts here
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#a04100" />
      </View>
    );
  }

  return (
    <ThemeProvider>
      <UserProvider>
        <LocationProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
            <Stack.Screen name="(user)" options={{ animation: 'fade' }} />
            <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
            <Stack.Screen name="(transactions)" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="(discovery)" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="(navigation)" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="(management)" options={{ animation: 'slide_from_right' }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', animation: 'slide_from_bottom' }} />
          </Stack>
        </LocationProvider>
      </UserProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff8f4',
  },
});
