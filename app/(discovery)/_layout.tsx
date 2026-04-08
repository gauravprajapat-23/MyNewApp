import { Stack } from 'expo-router';

export default function DiscoveryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="listings" />
      <Stack.Screen name="details" />
      <Stack.Screen name="explore" />
    </Stack>
  );
}
