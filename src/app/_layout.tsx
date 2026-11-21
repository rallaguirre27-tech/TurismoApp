import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { Colores } from '../constants/colores';
import { DesbloqueoProvider } from '../context/DesbloqueoContext';
import { FavoritosProvider } from '../context/FavoritosContext';

export default function RootLayout() {
  return (
    <FavoritosProvider>
      <DesbloqueoProvider>
        <StatusBar style="light" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: Colores.primario },
            headerTintColor: '#FFFFFF',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="lugar/[id]" options={{ title: 'Detalle del lugar' }} />
          <Stack.Screen name="ruta/[id]" options={{ title: 'Ruta' }} />
          <Stack.Screen name="comercio/[id]" options={{ title: 'Comercio' }} />
          <Stack.Screen
            name="pago"
            options={{ title: 'Desbloquear contenido', presentation: 'modal' }}
          />
        </Stack>
      </DesbloqueoProvider>
    </FavoritosProvider>
  );
}
