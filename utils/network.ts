import NetInfo from '@react-native-community/netinfo';
import { useState, useEffect } from 'react';

// Check network connection
export async function checkNetworkConnection(): Promise<boolean> {
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
}

// Get detailed network info
export async function getNetworkInfo() {
  return await NetInfo.fetch();
}

// React hook for network status
export function useNetworkStatus() {
  const [networkState, setNetworkState] = useState({
    isConnected: true,
    isWifi: false,
    isCellular: false,
  });

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isWifi: state.type === 'wifi',
        isCellular: state.type === 'cellular',
      });
    });

    // Initial state
    NetInfo.fetch().then(state => {
      setNetworkState({
        isConnected: state.isConnected ?? false,
        isWifi: state.type === 'wifi',
        isCellular: state.type === 'cellular',
      });
    });

    return unsubscribe;
  }, []);

  return networkState;
}
