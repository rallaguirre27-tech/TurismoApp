import { Linking, Pressable, StyleSheet, Text } from 'react-native';

import { Colores } from '../constants/colores';

type Props = {
  latitud: number;
  longitud: number;
  etiqueta?: string;
};

/** Abre Google Maps con la ruta a pie hasta el destino. Lo usan HU-01, HU-02 y HU-05. */
export function BotonComoLlegar({ latitud, longitud, etiqueta = 'Cómo llegar' }: Props) {
  const abrir = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitud},${longitud}&travelmode=walking`;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <Pressable style={styles.boton} onPress={abrir}>
      <Text style={styles.texto}>{etiqueta}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    backgroundColor: Colores.primario,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  texto: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
