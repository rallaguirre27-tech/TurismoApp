
import { Link } from 'expo-router';

import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colores } from '../../constants/colores';
import { useFavoritos } from '../../context/FavoritosContext';
import { lugares } from '../../data';
import BotonFavorito from '../../components/BotonFavorito';

export default function FavoritosScreen() {
  const { favoritos, cargando } = useFavoritos();

  // Obtener solamente los lugares guardados
  const lugaresGuardados = lugares.filter((lugar) =>
    favoritos.includes(lugar.id)
  );

  return (
    <View style={styles.contenedor}>

      <Text style={styles.titulo}>
        Mis favoritos
      </Text>

      <Text style={styles.subtitulo}>
        Tus lugares turísticos guardados
      </Text>

      {cargando ? (

        <View style={styles.estado}>
          <ActivityIndicator
            size="large"
            color={Colores.primario}
          />

          <Text style={styles.textoEstado}>
            Cargando favoritos...
          </Text>
        </View>

      ) : (

        <FlatList
          data={lugaresGuardados}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={
            lugaresGuardados.length === 0
              ? styles.listaVacia
              : styles.lista
          }

          ListEmptyComponent={
            <View style={styles.estadoVacio}>

              <Text style={styles.corazonVacio}>
                ♡
              </Text>

              <Text style={styles.tituloVacio}>
                Aún no tienes favoritos
              </Text>

              <Text style={styles.textoEstado}>
                Explora los lugares turísticos y
                presiona el corazón para guardarlos aquí.
              </Text>

            </View>
          }

          renderItem={({ item }) => (

            <View style={styles.tarjeta}>

              <Link
                href={{
                  pathname: '/lugar/[id]',
                  params: { id: String(item.id) },
                }}
                asChild
              >
                <Pressable style={styles.contenido}>

                  <Image
                    source={{ uri: item.imagen }}
                    style={styles.imagen}
                    resizeMode="cover"
                  />

                  <View style={styles.informacion}>

                    <Text style={styles.nombre}>
                      {item.nombre}
                    </Text>

                    <Text style={styles.categoria}>
                      {item.categoria} · {item.ciudad}
                    </Text>

                    <Text
                      style={styles.descripcion}
                      numberOfLines={2}
                    >
                      {item.descripcion}
                    </Text>

                  </View>

                </Pressable>
              </Link>

              <View style={styles.boton}>
                <BotonFavorito id={item.id} />
              </View>

            </View>
          )}
        />

      )}

    </View>
  );
}

const styles = StyleSheet.create({

  contenedor: {
    flex: 1,
    padding: 16,
    backgroundColor: Colores.fondo,
  },

  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colores.texto,
    marginTop: 10,
  },

  subtitulo: {
    fontSize: 14,
    color: Colores.textoSuave,
    marginTop: 5,
    marginBottom: 15,
  },

  lista: {
    paddingBottom: 20,
  },

  listaVacia: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colores.tarjeta,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colores.borde,
    marginBottom: 14,
    overflow: 'hidden',
  },

  contenido: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  imagen: {
    width: 105,
    height: 115,
  },

  informacion: {
    flex: 1,
    padding: 12,
  },

  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colores.texto,
  },

  categoria: {
    fontSize: 12,
    color: Colores.primario,
    marginTop: 5,
  },

  descripcion: {
    fontSize: 12,
    color: Colores.textoSuave,
    marginTop: 6,
  },

  boton: {
    paddingHorizontal: 8,
  },

  estado: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  estadoVacio: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  corazonVacio: {
    fontSize: 55,
    color: Colores.textoSuave,
  },

  tituloVacio: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colores.texto,
    marginTop: 12,
  },

  textoEstado: {
    fontSize: 14,
    color: Colores.textoSuave,
    textAlign: 'center',
    marginTop: 8,
  },

});

