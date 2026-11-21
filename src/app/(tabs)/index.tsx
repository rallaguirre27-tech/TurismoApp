import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import {
  FlatList,
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

export default function InicioScreen() {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<'Todas' | Categoria>('Todas');

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
      <View style={styles.encabezado}>
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

      <FlatList
        data={lugaresFiltrados}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listaContenido}
        showsVerticalScrollIndicator={false}
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
  encabezado: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: Colores.fondo,
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
  listaContenido: {
    padding: 16,
    paddingTop: 8,
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
