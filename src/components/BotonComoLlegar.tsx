import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';

import { Colores } from '../constants/colores';

interface Props {
  latitud: number;
  longitud: number;
}

/** Abre Google Maps con la ruta hacia las coordenadas del lugar. */
export default function BotonComoLlegar({ latitud, longitud }: Props) {
  const abrirMapa = async () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitud},${longitud}`;
    try {
      await Linking.openURL(url);
    } catch {
      Alert.alert('No se pudo abrir el mapa', 'Intenta de nuevo o abre Google Maps manualmente.');
    }
  };

  return (
    <Pressable
      onPress={abrirMapa}
      accessibilityRole="button"
      accessibilityLabel="Cómo llegar"
      style={({ pressed }) => [styles.boton, pressed && styles.presionado]}
    >
      <Ionicons name="navigate" size={18} color="#FFFFFF" />
      <Text style={styles.texto}>Cómo llegar</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colores.primario,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  presionado: {
    opacity: 0.85,
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});