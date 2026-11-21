import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { Image } from 'expo-image';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

import BotonComoLlegar from '../../components/BotonComoLlegar';
import { Colores } from '../../constants/colores';
import { lugares } from '../../data';
import { Categoria, Lugar } from '../../types/lugar';

/** Color del marcador según la categoría del lugar. */
const COLOR_MARCADOR: Record<Categoria, string> = {
  Naturaleza: '#2E9E5B',
  Historia: '#B5651D',
  Gastronomía: '#E5484D',
  Aventura: '#F4A259',
  Cultura: '#6E56CF',
};

export default function MapaScreen() {
  const router = useRouter();
  const mapaRef = useRef<MapView>(null);
  const [seleccionado, setSeleccionado] = useState<Lugar | null>(null);
  // Ids de lugares cuya foto no pudo cargarse (para mostrar un recuadro de respaldo).
  const [fotosConError, setFotosConError] = useState<Record<number, boolean>>({});

  // Ajusta el zoom para que se vean todos los marcadores al abrir el mapa.
  const ajustarVista = useCallback(() => {
    mapaRef.current?.fitToCoordinates(
      lugares.map((l) => ({ latitude: l.latitud, longitude: l.longitud })),
      {
        edgePadding: { top: 80, right: 60, bottom: 80, left: 60 },
        animated: false,
      },
    );
  }, []);

  const verDetalle = (lugar: Lugar) => {
    router.push({ pathname: '/lugar/[id]', params: { id: String(lugar.id) } });
  };

  return (
    <View style={styles.contenedor}>
      <MapView
        ref={mapaRef}
        style={styles.mapa}
        onMapReady={ajustarVista}
        onPress={(e) => {
          // En Android, tocar un marcador también dispara este evento: lo ignoramos
          // para que la tarjeta no se cierre al instante.
          if (e.nativeEvent.action !== 'marker-press') setSeleccionado(null);
        }}
        toolbarEnabled={false}
      >
        {lugares.map((lugar) => (
          <Marker
            key={lugar.id}
            coordinate={{ latitude: lugar.latitud, longitude: lugar.longitud }}
            title={lugar.nombre}
            description={lugar.categoria}
            pinColor={COLOR_MARCADOR[lugar.categoria]}
            onPress={(e) => {
              e.stopPropagation();
              setSeleccionado(lugar);
            }}
          />
        ))}
      </MapView>

      {seleccionado && (
        <View style={styles.panel}>
          {fotosConError[seleccionado.id] ? (
            <View style={[styles.foto, styles.fotoVacia]}>
              <Ionicons name="image-outline" size={32} color={Colores.textoSuave} />
              <Text style={styles.fotoVaciaTexto}>Foto no disponible</Text>
            </View>
          ) : (
            <Image
              source={{
                uri: seleccionado.imagen,
                headers: { 'User-Agent': 'TurismoApp/1.0 (proyecto educativo)' },
              }}
              style={styles.foto}
              contentFit="cover"
              cachePolicy="memory-disk"
              priority="high"
              recyclingKey={String(seleccionado.id)}
              onError={() =>
                setFotosConError((previo) => ({ ...previo, [seleccionado.id]: true }))
              }
              accessibilityLabel={`Foto de ${seleccionado.nombre}`}
            />
          )}
          <Text style={styles.nombre} numberOfLines={2}>
            {seleccionado.nombre}
          </Text>
          <Text style={styles.detalle}>
            {seleccionado.categoria} · {seleccionado.ciudad}
          </Text>

          <View style={styles.acciones}>
            <Pressable
              onPress={() => verDetalle(seleccionado)}
              accessibilityRole="button"
              accessibilityLabel={`Ver detalle de ${seleccionado.nombre}`}
              style={({ pressed }) => [styles.botonSecundario, pressed && styles.presionado]}
            >
              <Text style={styles.textoSecundario}>Ver detalle</Text>
            </Pressable>
            <BotonComoLlegar latitud={seleccionado.latitud} longitud={seleccionado.longitud} />
          </View>
        </View>
      )}
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
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 16,
    padding: 16,
    borderRadius: 14,
    backgroundColor: Colores.tarjeta,
    borderWidth: 1,
    borderColor: Colores.borde,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  foto: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    backgroundColor: Colores.borde,
    marginBottom: 12,
  },
  fotoVacia: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  fotoVaciaTexto: {
    fontSize: 13,
    color: Colores.textoSuave,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colores.texto,
  },
  detalle: {
    fontSize: 14,
    color: Colores.textoSuave,
    marginTop: 2,
    marginBottom: 12,
  },
  acciones: {
    flexDirection: 'row',
    gap: 10,
  },
  botonSecundario: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colores.primario,
  },
  presionado: {
    opacity: 0.85,
  },
  textoSecundario: {
    color: Colores.primario,
    fontSize: 15,
    fontWeight: '600',
  },
});