
import { StyleSheet, Text, View } from 'react-native';
import { useNetInfo } from '@react-native-community/netinfo';

import { Colores } from '../constants/colores';

export default function BannerSinConexion() {
  const { isConnected, isInternetReachable } = useNetInfo();

  // Detectar cuando no existe conexión a Internet.
  const sinConexion =
    isConnected === false ||
    isInternetReachable === false;

  // No mostrar el aviso si existe conexión.
  if (!sinConexion) {
    return null;
  }

  return (
    <View style={styles.contenedor}>

      <Text style={styles.titulo}>
        Sin conexión a Internet
      </Text>

      <Text style={styles.mensaje}>
        Puedes consultar las rutas que descargaste
        anteriormente en este dispositivo.
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({

  contenedor: {
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderLeftWidth: 5,
    borderColor: Colores.secundario,
    backgroundColor: Colores.tarjeta,
  },

  titulo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colores.texto,
  },

  mensaje: {
    fontSize: 13,
    color: Colores.textoSuave,
    lineHeight: 19,
    marginTop: 4,
  },

});
