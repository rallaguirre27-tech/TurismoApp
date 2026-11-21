import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { LugarCard } from '../../components/LugarCard';
import { Colores } from '../../constants/colores';
import { lugares } from '../../data';
import { Categoria } from '../../types/lugar';

const CATEGORIAS: ('Todas' | Categoria)[] = [
  'Todas',
  'Historia',
  'Naturaleza',
  'Cultura',
  'Gastronomía',
  'Aventura',
];

const IMAGENES_BANNER_AYACUCHO = [
  'https://portal.andina.pe/EDPfotografia3/Thumbnail/2024/04/24/001058672W.webp',
  'https://images.trvl-media.com/place/6116980/c31aafd0-930b-4a25-954d-6565a8f89b4a.jpg',
  'https://comunicaciones.congreso.gob.pe/wpuploads/2025/03/post-de-corredor-turistico-de-ayacucho.jpg',
  'https://larepublica.cronosmedia.glr.pe/original/2019/03/20/60563f5cd806221c2f1555d8.jpg',
];

export default function InicioScreen() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<'Todas' | Categoria>('Todas');
  const [indiceBanner, setIndiceBanner] = useState(0);

  useEffect(() => {
    const intervalo = setInterval(() => {
      setIndiceBanner((prev) => (prev + 1) % IMAGENES_BANNER_AYACUCHO.length);
    }, 3500);
    return () => clearInterval(intervalo);
  }, []);

  const lugaresFiltrados = useMemo(() => {
    return lugares.filter((lugar) => {
      const coincideCategoria =
        categoriaSeleccionada === 'Todas' || lugar.categoria === categoriaSeleccionada;
      const texto = busqueda.trim().toLowerCase();
      const coincideTexto =
        texto === '' ||
        lugar.nombre.toLowerCase().includes(texto) ||
        lugar.ciudad.toLowerCase().includes(texto);
      return coincideCategoria && coincideTexto;
    });
  }, [busqueda, categoriaSeleccionada]);

  return (
    <View style={styles.contenedor}>
      <FlatList
        data={lugaresFiltrados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listaContenido}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.encabezado}>
            <View style={styles.contenedorBanner}>
              <Image
                source={{ uri: IMAGENES_BANNER_AYACUCHO[indiceBanner] }}
                style={styles.bannerPlaza}
                resizeMode="cover"
              />
              <View style={styles.pieBanner}>
                <View style={styles.etiquetaBanner}>
                  <Text style={styles.textoBanner}>Plaza Mayor • Huamanga, Ayacucho</Text>
                </View>
                <View style={styles.indicadores}>
                  {IMAGENES_BANNER_AYACUCHO.map((_, idx) => (
                    <Pressable
                      key={idx}
                      onPress={() => setIndiceBanner(idx)}
                      style={[
                        styles.punto,
                        indiceBanner === idx && styles.puntoActivo,
                      ]}
                    />
                  ))}
                </View>
              </View>
            </View>

            <Text style={styles.titulo}>Descubre Ayacucho</Text>
            <Text style={styles.subtitulo}>
              Explora los principales atractivos históricos y naturales
            </Text>

            <TextInput
              style={styles.buscador}
              placeholder="Buscar atractivo o distrito..."
              placeholderTextColor={Colores.textoSuave}
              value={busqueda}
              onChangeText={setBusqueda}
            />

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.listaCategorias}
            >
              {CATEGORIAS.map((cat) => {
                const activa = categoriaSeleccionada === cat;
                return (
                  <Pressable
                    key={cat}
                    onPress={() => setCategoriaSeleccionada(cat)}
                    style={[styles.chipCategoria, activa && styles.chipCategoriaActiva]}
                  >
                    <Text style={[styles.textoChip, activa && styles.textoChipActiva]}>{cat}</Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        }
        renderItem={({ item }) => (
          <LugarCard
            lugar={item}
            onPress={() => router.push(`/lugar/${item.id}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.vacio}>
            <Text style={styles.textoVacio}>
              No se encontraron lugares con ese filtro.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colores.fondo,
  },
  listaContenido: {
    padding: 16,
  },
  encabezado: {
    marginBottom: 14,
  },
  contenedorBanner: {
    position: 'relative',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 14,
    backgroundColor: Colores.borde,
    elevation: 2,
  },
  bannerPlaza: {
    width: '100%',
    height: 165,
  },
  pieBanner: {
    position: 'absolute',
    bottom: 8,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  etiquetaBanner: {
    backgroundColor: 'rgba(14, 124, 134, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  textoBanner: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  indicadores: {
    flexDirection: 'row',
    gap: 5,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  punto: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  puntoActivo: {
    backgroundColor: '#FFFFFF',
    width: 14,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colores.texto,
  },
  subtitulo: {
    fontSize: 14,
    color: Colores.textoSuave,
    marginTop: 2,
    marginBottom: 12,
  },
  buscador: {
    backgroundColor: Colores.tarjeta,
    borderWidth: 1,
    borderColor: Colores.borde,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: Colores.texto,
    marginBottom: 10,
  },
  listaCategorias: {
    gap: 8,
    paddingVertical: 4,
  },
  chipCategoria: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colores.tarjeta,
    borderWidth: 1,
    borderColor: Colores.borde,
  },
  chipCategoriaActiva: {
    backgroundColor: Colores.primario,
    borderColor: Colores.primario,
  },
  textoChip: {
    fontSize: 13,
    fontWeight: '600',
    color: Colores.textoSuave,
  },
  textoChipActiva: {
    color: '#FFFFFF',
  },
  vacio: {
    padding: 32,
    alignItems: 'center',
  },
  textoVacio: {
    fontSize: 15,
    color: Colores.textoSuave,
    textAlign: 'center',
  },
});
