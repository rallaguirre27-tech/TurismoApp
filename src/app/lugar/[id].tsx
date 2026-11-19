import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colores } from '../../constants/colores';

export default function DetalleLugarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Detalle del lugar</Text>
      <Text style={styles.subtitulo}>Lugar con id: {id}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colores.fondo,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colores.texto,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitulo: {
    fontSize: 15,
    color: Colores.textoSuave,
    textAlign: 'center',
  },
});
