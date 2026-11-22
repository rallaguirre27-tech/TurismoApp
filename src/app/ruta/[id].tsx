import { useLocalSearchParams } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';

import { Colores } from '../../constants/colores';
import { CandadoPremium } from '../../components/CandadoPremium';
import { useDesbloqueo } from '../../context/DesbloqueoContext';
import { obtenerRutaPorId, obtenerContenidoPremium } from '../../data';

export default function RutaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const rutaId = Number(id);
  const ruta = obtenerRutaPorId(rutaId);

  const { estaDesbloqueado, cargando } = useDesbloqueo();

  if (!ruta) {
    return (
        <View style={styles.contenedor}>
          <Text style={styles.titulo}>Ruta no encontrada</Text>
          <Text style={styles.descripcion}>
            No existe una ruta con el identificador solicitado.
          </Text>
        </View>
    );
  }

  const contenidoId = `ruta-${ruta.id}`;
  const contenidoPremium = obtenerContenidoPremium(contenidoId);

  if (ruta.premium && !estaDesbloqueado(contenidoId)) {
    return (
        <View style={styles.contenedor}>
          <Text style={styles.titulo}>{ruta.nombre}</Text>
          <Text style={styles.descripcion}>{ruta.descripcion}</Text>

          {cargando ? (
              <Text>Verificando acceso...</Text>
          ) : contenidoPremium ? (
              <CandadoPremium
                  contenidoId={contenidoId}
                  precio={contenidoPremium.precio}
              />
          ) : (
              <Text>No se encontró la información de compra de esta ruta.</Text>
          )}
        </View>
    );
  }

  return (
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>{ruta.nombre}</Text>

        <Text style={styles.descripcion}>{ruta.descripcion}</Text>

        <Text style={styles.dato}>
          Duración: {ruta.duracionMin} minutos
        </Text>

        <Text style={styles.dato}>
          Número de paradas: {ruta.paradas.length}
        </Text>

        <Text style={styles.estado}>
          {ruta.premium
              ? '🔓 Ruta premium desbloqueada'
              : '🆓 Ruta gratuita'}
        </Text>
      </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    padding: 24,
    backgroundColor: Colores.fondo,
  },
  titulo: {
    fontSize: 23,
    fontWeight: 'bold',
    color: Colores.texto,
    marginBottom: 12,
  },
  descripcion: {
    fontSize: 15,
    color: Colores.textoSuave,
    marginBottom: 20,
  },
  dato: {
    fontSize: 16,
    color: Colores.texto,
    marginBottom: 12,
  },
  estado: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colores.primario,
    marginTop: 16,
  },
});
