import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colores } from '../constants/colores';
import { FavoritosProvider } from '../context/FavoritosContext';

export default function RootLayout() {
  return (
    <FavoritosProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: Colores.primario },
          headerTintColor: '#FFFFFF',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="lugar/[id]" options={{ title: 'Detalle del lugar' }} />
      </Stack>
    </FavoritosProvider>
  );
}
