import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { Colores } from '../../constants/colores';

export default function InicioScreen() {
  return (
    <View style={styles.contenedor}>
      <Text style={styles.titulo}>Descubre lugares turísticos</Text>
      <Text style={styles.subtitulo}>Aquí irá la lista de lugares (Fase 5).</Text>
      <Link href="/lugar/1" style={styles.enlace}>
        Probar navegación al detalle
      </Link>
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
    marginBottom: 20,
    textAlign: 'center',
  },
  enlace: {
    fontSize: 16,
    color: Colores.primario,
    fontWeight: '600',
  },
});
