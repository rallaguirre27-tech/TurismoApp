import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import { SelectorTiempo } from '../../components/SelectorTiempo';
import { Colores } from '../../constants/colores';
import { useDesbloqueo } from '../../context/DesbloqueoContext';
import { lugares, rutas } from '../../data';
import { Ruta } from '../../types/ruta';

/** Centro aproximado de la ciudad de Huamanga (Ayacucho). */
const CENTRO_HUAMANGA = { latitude: -13.1588, longitude: -74.2236 };

/**
 * Mapa centrado en Huamanga, con zoom suficiente para que se vea el atractivo
 * más lejano. Si se agregan lugares, el zoom se recalcula solo.
 */
const REGION_INICIAL = (() => {
  const distanciaMaxima = Math.max(
    0,
    ...lugares.map((lugar) =>
      Math.max(
        Math.abs(lugar.latitud - CENTRO_HUAMANGA.latitude),
        Math.abs(lugar.longitud - CENTRO_HUAMANGA.longitude),
      ),
    ),
  );
  const delta = Math.max(0.05, distanciaMaxima * 2.4);
  return { ...CENTRO_HUAMANGA, latitudeDelta: delta, longitudeDelta: delta };
})();

export default function MapaScreen() {
  const router = useRouter();
  const { estaDesbloqueado, cargando } = useDesbloqueo();

  const abrirRuta = (ruta: Ruta) => {
    const contenidoId = `ruta-${ruta.id}`;

    if (ruta.premium && !estaDesbloqueado(contenidoId)) {
      // Todavía leyendo los desbloqueos guardados: esperamos para no pedir pago de más.
      if (cargando) return;
      router.push({ pathname: '/pago', params: { contenido: contenidoId } });
      return;
    }

    router.push({ pathname: '/ruta/[id]', params: { id: String(ruta.id) } });
  };

  return (
    <View style={styles.contenedor}>
      <MapView style={styles.mapa} initialRegion={REGION_INICIAL} toolbarEnabled={false}>
        {lugares.map((lugar) => (
          <Marker
            key={lugar.id}
            coordinate={{ latitude: lugar.latitud, longitude: lugar.longitud }}
            title={lugar.nombre}
            description="Toca aquí para ver el detalle"
            pinColor={Colores.primario}
            onCalloutPress={() =>
              router.push({ pathname: '/lugar/[id]', params: { id: String(lugar.id) } })
            }
          />
        ))}
      </MapView>

      <View style={styles.panel}>
        <ScrollView contentContainerStyle={styles.panelContenido}>
          <SelectorTiempo rutas={rutas} onElegirRuta={abrirRuta} />
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colores.fondo,
  },
  mapa: {
    flex: 1,
  },
  panel: {
    maxHeight: '48%',
    backgroundColor: Colores.tarjeta,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderColor: Colores.borde,
  },
  panelContenido: {
    padding: 16,
  },
});