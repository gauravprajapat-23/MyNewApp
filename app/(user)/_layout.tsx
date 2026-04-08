import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="explore" />
      <Stack.Screen name="agent-details" />
      <Stack.Screen name="map-view" />
      <Stack.Screen name="favorites" />
    </Stack>
  );
}
