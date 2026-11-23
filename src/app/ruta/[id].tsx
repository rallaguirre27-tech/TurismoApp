import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';

import { BotonComoLlegar } from '../../components/BotonComoLlegar';
import { CandadoPremium } from '../../components/CandadoPremium';
import { formatearDuracion } from '../../components/SelectorTiempo';
import { Colores } from '../../constants/colores';
import { useDesbloqueo } from '../../context/DesbloqueoContext';
import { lugaresDeRuta, obtenerContenidoPremium, obtenerRutaPorId } from '../../data';
import { Lugar } from '../../types/lugar';

/** Región del mapa que abarca todas las paradas con un pequeño margen. */
function regionDeParadas(paradas: Lugar[]) {
  const latitudes = paradas.map((lugar) => lugar.latitud);
  const longitudes = paradas.map((lugar) => lugar.longitud);
  const minLat = Math.min(...latitudes);
  const maxLat = Math.max(...latitudes);
  const minLon = Math.min(...longitudes);
  const maxLon = Math.max(...longitudes);

  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLon + maxLon) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.5, 0.02),
    longitudeDelta: Math.max((maxLon - minLon) * 1.5, 0.02),
  };
}

export default function RutaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { estaDesbloqueado, cargando } = useDesbloqueo();

  const ruta = obtenerRutaPorId(Number(id));

  if (!ruta) {
    return (
      <View style={styles.centrado}>
        <Text style={styles.titulo}>Ruta no encontrada</Text>
        <Text style={styles.descripcion}>No existe una ruta con el identificador solicitado.</Text>
      </View>
    );
  }

  const contenidoId = `ruta-${ruta.id}`;

  // Ruta premium sin desbloquear: se muestra el candado (también si se entra por enlace directo).
  if (ruta.premium && !estaDesbloqueado(contenidoId)) {
    const contenidoPremium = obtenerContenidoPremium(contenidoId);

    return (
      <View style={styles.centrado}>
        <Stack.Screen options={{ title: ruta.nombre }} />
        <Text style={styles.titulo}>{ruta.nombre}</Text>
        <Text style={styles.descripcion}>{ruta.descripcion}</Text>
        <Text style={styles.dato}>
          {formatearDuracion(ruta.duracionMin)} · {ruta.paradas.length} paradas
        </Text>

        {cargando ? (
          <Text style={styles.descripcion}>Verificando acceso...</Text>
        ) : contenidoPremium ? (
          <CandadoPremium contenidoId={contenidoId} precio={contenidoPremium.precio} />
        ) : (
          <Text style={styles.descripcion}>
            No se encontró la información de compra de esta ruta.
          </Text>
        )}
      </View>
    );
  }

  const paradas = lugaresDeRuta(ruta);

  if (paradas.length === 0) {
    return (
      <View style={styles.centrado}>
        <Stack.Screen options={{ title: ruta.nombre }} />
        <Text style={styles.titulo}>{ruta.nombre}</Text>
        <Text style={styles.descripcion}>Esta ruta todavía no tiene paradas disponibles.</Text>
      </View>
    );
  }

  const verLugar = (lugarId: number) =>
    router.push({ pathname: '/lugar/[id]', params: { id: String(lugarId) } });

  return (
    <View style={styles.pantalla}>
      <Stack.Screen options={{ title: ruta.nombre }} />

      <MapView style={styles.mapa} initialRegion={regionDeParadas(paradas)} toolbarEnabled={false}>
        <Polyline
          coordinates={paradas.map((lugar) => ({
            latitude: lugar.latitud,
            longitude: lugar.longitud,
          }))}
          strokeColor={Colores.primario}
          strokeWidth={4}
        />
        {paradas.map((lugar, indice) => (
          <Marker
            key={lugar.id}
            coordinate={{ latitude: lugar.latitud, longitude: lugar.longitud }}
            title={`${indice + 1}. ${lugar.nombre}`}
            description="Toca aquí para ver el detalle"
            pinColor={Colores.secundario}
            onCalloutPress={() => verLugar(lugar.id)}
          />
        ))}
      </MapView>

      <ScrollView contentContainerStyle={styles.lista}>
        <Text style={styles.titulo}>{ruta.nombre}</Text>
        <Text style={styles.descripcion}>{ruta.descripcion}</Text>

        <View style={styles.datos}>
          <Text style={styles.dato}>⏱ {formatearDuracion(ruta.duracionMin)}</Text>
          <Text style={styles.dato}>📍 {paradas.length} paradas</Text>
          <Text style={styles.dato}>{ruta.premium ? '🔓 Premium' : '🆓 Gratis'}</Text>
        </View>

        <Text style={styles.subtitulo}>Paradas en orden</Text>

        {paradas.map((lugar, indice) => (
          <View key={lugar.id} style={styles.parada}>
            <View style={styles.numero}>
              <Text style={styles.numeroTexto}>{indice + 1}</Text>
            </View>

            <View style={styles.paradaTexto}>
              <Text style={styles.nombre}>{lugar.nombre}</Text>
              <Text style={styles.detalle}>
                {lugar.categoria} · {lugar.ciudad}
              </Text>

              <View style={styles.acciones}>
                <Pressable
                  onPress={() => verLugar(lugar.id)}
                  accessibilityRole="button"
                  accessibilityLabel={`Ver detalle de ${lugar.nombre}`}
                  style={({ pressed }) => [styles.botonSecundario, pressed && styles.presionado]}
                >
                  <Text style={styles.botonSecundarioTexto}>Ver detalle</Text>
                </Pressable>
                <BotonComoLlegar latitud={lugar.latitud} longitud={lugar.longitud} />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  pantalla: {
    flex: 1,
    backgroundColor: Colores.fondo,
  },
  centrado: {
    flex: 1,
    padding: 24,
    backgroundColor: Colores.fondo,
  },
  mapa: {
    height: 260,
  },
  lista: {
    padding: 20,
  },
  titulo: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colores.texto,
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 15,
    color: Colores.textoSuave,
    marginBottom: 14,
  },
  datos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    marginBottom: 18,
  },
  dato: {
    fontSize: 14,
    fontWeight: '600',
    color: Colores.texto,
  },
  subtitulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colores.primario,
    marginBottom: 12,
  },
  parada: {
    flexDirection: 'row',
    gap: 12,
    padding: 14,
    marginBottom: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colores.borde,
    backgroundColor: Colores.tarjeta,
  },
  numero: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colores.primario,
  },
  numeroTexto: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  paradaTexto: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colores.texto,
  },
  detalle: {
    fontSize: 13,
    color: Colores.textoSuave,
    marginTop: 2,
    marginBottom: 12,
  },
  acciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  botonSecundario: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colores.primario,
    alignItems: 'center',
  },
  presionado: {
    opacity: 0.85,
  },
  botonSecundarioTexto: {
    color: Colores.primario,
    fontSize: 16,
    fontWeight: '600',
  },
});