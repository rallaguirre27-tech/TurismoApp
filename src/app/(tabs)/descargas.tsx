
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Colores } from '../../constants/colores';
import { rutas } from '../../data';

import BannerSinConexion from '../../components/BannerSinConexion';

import {
  descargarRuta,
  eliminarDescarga,
  listarDescargas,
  obtenerContenidoDescargado,
} from '../../services/descargas';

import type { ContenidoRutaDescargada } from '../../services/descargas';

const CLAVE_DESBLOQUEADOS = 'desbloqueados';

export default function DescargasScreen() {
  const [descargadas, setDescargadas] = useState<number[]>([]);
  const [desbloqueados, setDesbloqueados] = useState<string[]>([]);

  const [cargando, setCargando] = useState(true);
  const [procesandoId, setProcesandoId] = useState<number | null>(null);

  const [rutaExpandida, setRutaExpandida] = useState<number | null>(null);

  const [contenidoPorRuta, setContenidoPorRuta] = useState<
    Record<number, ContenidoRutaDescargada | null>
  >({});

  const [cargandoContenidoId, setCargandoContenidoId] = useState<number | null>(
    null
  );

  const [mensajes, setMensajes] = useState<Record<number, string>>({});

  // Cargar el estado de las descargas y desbloqueos.
  useFocusEffect(
    useCallback(() => {
      let activa = true;

      async function cargarEstado() {
        setCargando(true);

        try {
          const [ids, valorDesbloqueados] = await Promise.all([
            listarDescargas(),
            AsyncStorage.getItem(CLAVE_DESBLOQUEADOS),
          ]);

          let listaDesbloqueados: string[] = [];

          if (valorDesbloqueados) {
            try {
              const datos: unknown = JSON.parse(valorDesbloqueados);

              if (
                Array.isArray(datos) &&
                datos.every((id) => typeof id === 'string')
              ) {
                listaDesbloqueados = datos;
              }
            } catch {
              listaDesbloqueados = [];
            }
          }

          if (activa) {
            setDescargadas(ids);
            setDesbloqueados(listaDesbloqueados);
          }
        } catch {
          if (activa) {
            setMensajes({
              0: 'No se pudo recuperar el estado de las descargas.',
            });
          }
        } finally {
          if (activa) {
            setCargando(false);
          }
        }
      }

      void cargarEstado();

      return () => {
        activa = false;
      };
    }, [])
  );

  // Descargar una ruta.
  async function manejarDescarga(ruta: (typeof rutas)[number]) {
    const bloqueada =
      ruta.premium &&
      !desbloqueados.includes(`ruta-${ruta.id}`);

    if (bloqueada) {
      setMensajes((actuales) => ({
        ...actuales,
        [ruta.id]: 'Debes desbloquear esta ruta premium antes de descargarla.',
      }));
      return;
    }

    setProcesandoId(ruta.id);

    setMensajes((actuales) => ({
      ...actuales,
      [ruta.id]: '',
    }));

    try {
      await descargarRuta(ruta);

      const ids = await listarDescargas();

      setDescargadas(ids);

      setMensajes((actuales) => ({
        ...actuales,
        [ruta.id]: 'Ruta descargada correctamente.',
      }));
    } catch (error) {
      setMensajes((actuales) => ({
        ...actuales,
        [ruta.id]:
          error instanceof Error
            ? error.message
            : 'No se pudo descargar la ruta.',
      }));
    } finally {
      setProcesandoId(null);
    }
  }

  // Eliminar una ruta descargada.
  async function manejarEliminacion(rutaId: number) {
    setProcesandoId(rutaId);

    try {
      await eliminarDescarga(rutaId);

      const ids = await listarDescargas();

      setDescargadas(ids);

      setContenidoPorRuta((actuales) => {
        const nuevos = { ...actuales };
        delete nuevos[rutaId];
        return nuevos;
      });

      if (rutaExpandida === rutaId) {
        setRutaExpandida(null);
      }

      setMensajes((actuales) => ({
        ...actuales,
        [rutaId]: 'Descarga eliminada correctamente.',
      }));
    } catch {
      setMensajes((actuales) => ({
        ...actuales,
        [rutaId]: 'No se pudo eliminar la descarga.',
      }));
    } finally {
      setProcesandoId(null);
    }
  }

  // Leer el contenido guardado directamente del celular.
  async function mostrarContenido(rutaId: number) {
    if (rutaExpandida === rutaId) {
      setRutaExpandida(null);
      return;
    }

    setRutaExpandida(rutaId);

    if (contenidoPorRuta[rutaId]) {
      return;
    }

    setCargandoContenidoId(rutaId);

    try {
      const contenido = await obtenerContenidoDescargado(rutaId);

      setContenidoPorRuta((actuales) => ({
        ...actuales,
        [rutaId]: contenido,
      }));

      if (!contenido) {
        setMensajes((actuales) => ({
          ...actuales,
          [rutaId]: 'No se encontró el contenido guardado.',
        }));
      }
    } catch {
      setMensajes((actuales) => ({
        ...actuales,
        [rutaId]: 'No se pudo leer el contenido descargado.',
      }));
    } finally {
      setCargandoContenidoId(null);
    }
  }

  return (
    <ScrollView
      style={styles.contenedor}
      contentContainerStyle={styles.contenido}
    >
      <Text style={styles.titulo}>
        Mis descargas
      </Text>

      <Text style={styles.subtitulo}>
        Guarda tus rutas para consultarlas sin Internet.
      </Text>

      <BannerSinConexion />

      <View style={styles.resumen}>
        <Text style={styles.resumenTexto}>
          Rutas descargadas: {descargadas.length}
        </Text>
      </View>

      {cargando ? (
        <View style={styles.cargando}>
          <ActivityIndicator
            size="large"
            color={Colores.primario}
          />
          <Text style={styles.textoSecundario}>
            Cargando descargas...
          </Text>
        </View>
      ) : rutas.length === 0 ? (
        <Text style={styles.textoVacio}>
          No hay rutas disponibles.
        </Text>
      ) : (
        rutas.map((ruta) => {
          const descargada = descargadas.includes(ruta.id);

          const bloqueada =
            ruta.premium &&
            !desbloqueados.includes(`ruta-${ruta.id}`);

          const expandida = rutaExpandida === ruta.id;

          const contenido = contenidoPorRuta[ruta.id];

          return (
            <View key={ruta.id} style={styles.tarjeta}>

              <View style={styles.cabecera}>
                <View style={styles.informacion}>
                  <Text style={styles.nombre}>
                    {ruta.nombre}
                  </Text>

                  <Text style={styles.descripcion}>
                    {ruta.descripcion}
                  </Text>

                  <Text style={styles.detalle}>
                    Duración: {ruta.duracionMin} minutos
                  </Text>

                  <Text style={styles.detalle}>
                    Paradas: {ruta.paradas.length}
                  </Text>
                </View>

                <View
                  style={[
                    styles.etiqueta,
                    ruta.premium
                      ? styles.etiquetaPremium
                      : styles.etiquetaGratis,
                  ]}
                >
                  <Text style={styles.textoEtiqueta}>
                    {ruta.premium ? 'PREMIUM' : 'GRATUITA'}
                  </Text>
                </View>
              </View>

              <View
                style={[
                  styles.estado,
                  descargada
                    ? styles.estadoDescargada
                    : bloqueada
                      ? styles.estadoBloqueada
                      : styles.estadoDisponible,
                ]}
              >
                <Text style={styles.textoEstado}>
                  {descargada
                    ? 'Descargada'
                    : bloqueada
                      ? 'Pendiente de desbloqueo'
                      : 'Disponible para descargar'}
                </Text>
              </View>

              <View style={styles.botones}>

                <Pressable
                  style={[
                    styles.botonDescargar,
                    (descargada || bloqueada || procesandoId !== null) &&
                      styles.botonDeshabilitado,
                  ]}
                  disabled={
                    descargada ||
                    bloqueada ||
                    procesandoId !== null ||
                    cargando
                  }
                  onPress={() => manejarDescarga(ruta)}
                >
                  <Text style={styles.textoBoton}>
                    {procesandoId === ruta.id
                      ? 'Procesando...'
                      : descargada
                        ? 'Descargada'
                        : bloqueada
                          ? 'Bloqueada'
                          : 'Descargar'}
                  </Text>
                </Pressable>

                {descargada && (
                  <Pressable
                    style={[
                      styles.botonEliminar,
                      procesandoId !== null &&
                        styles.botonDeshabilitado,
                    ]}
                    disabled={procesandoId !== null}
                    onPress={() => manejarEliminacion(ruta.id)}
                  >
                    <Text style={styles.textoBotonEliminar}>
                      Eliminar
                    </Text>
                  </Pressable>
                )}

              </View>

              {bloqueada && !descargada && (
                <Text style={styles.avisoPremium}>
                  Desbloquea esta ruta para poder descargarla.
                </Text>
              )}

              {descargada && (
                <Pressable
                  style={styles.botonContenido}
                  onPress={() => mostrarContenido(ruta.id)}
                >
                  <Text style={styles.textoContenido}>
                    {expandida
                      ? 'Ocultar contenido'
                      : 'Ver contenido sin conexión'}
                  </Text>
                </Pressable>
              )}

              {expandida && (
                <View style={styles.contenidoOffline}>

                  {cargandoContenidoId === ruta.id ? (
                    <ActivityIndicator color={Colores.primario} />
                  ) : contenido ? (
                    contenido.lugares.map((lugar) => (
                      <View
                        key={lugar.id}
                        style={styles.tarjetaLugar}
                      >
                        <Image
                          source={{ uri: lugar.imagen }}
                          style={styles.imagen}
                          resizeMode="cover"
                        />

                        <Text style={styles.nombreLugar}>
                          {lugar.nombre}
                        </Text>

                        <Text style={styles.categoria}>
                          {lugar.categoria} · {lugar.ciudad}
                        </Text>

                        <Text style={styles.descripcionLugar}>
                          {lugar.descripcion}
                        </Text>

                        <Text style={styles.coordenadas}>
                          Latitud: {lugar.latitud}
                        </Text>

                        <Text style={styles.coordenadas}>
                          Longitud: {lugar.longitud}
                        </Text>

                        {lugar.horario && (
                          <Text style={styles.coordenadas}>
                            Horario: {lugar.horario}
                          </Text>
                        )}

                        {(lugar.galeria ?? []).map((foto, indice) => (
                          <Image
                            key={`${lugar.id}-galeria-${indice}`}
                            source={{ uri: foto }}
                            style={styles.imagenGaleria}
                            resizeMode="cover"
                          />
                        ))}
                      </View>
                    ))
                  ) : (
                    <Text style={styles.textoSecundario}>
                      No se pudo recuperar el contenido guardado.
                    </Text>
                  )}

                </View>
              )}

              {mensajes[ruta.id] ? (
                <Text style={styles.mensaje}>
                  {mensajes[ruta.id]}
                </Text>
              ) : null}

            </View>
          );
        })
      )}

      {mensajes[0] ? (
        <Text style={styles.mensaje}>
          {mensajes[0]}
        </Text>
      ) : null}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  contenedor: {
    flex: 1,
    backgroundColor: Colores.fondo,
  },

  contenido: {
    padding: 16,
    paddingBottom: 35,
  },

  titulo: {
    fontSize: 25,
    fontWeight: 'bold',
    color: Colores.texto,
    marginTop: 10,
  },

  subtitulo: {
    fontSize: 14,
    color: Colores.textoSuave,
    marginTop: 5,
    marginBottom: 10,
  },

  resumen: {
    backgroundColor: Colores.tarjeta,
    padding: 13,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colores.borde,
    marginVertical: 12,
  },

  resumenTexto: {
    fontSize: 15,
    fontWeight: 'bold',
    color: Colores.primario,
  },

  cargando: {
    padding: 30,
    alignItems: 'center',
    gap: 10,
  },

  tarjeta: {
    backgroundColor: Colores.tarjeta,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Colores.borde,
    marginBottom: 16,
  },

  cabecera: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 10,
  },

  informacion: {
    flex: 1,
  },

  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colores.texto,
  },

  descripcion: {
    fontSize: 13,
    color: Colores.textoSuave,
    marginTop: 6,
    lineHeight: 19,
  },

  detalle: {
    fontSize: 13,
    color: Colores.textoSuave,
    marginTop: 5,
  },

  etiqueta: {
    borderRadius: 7,
    padding: 7,
  },

  etiquetaPremium: {
    backgroundColor: '#FFF0D9',
  },

  etiquetaGratis: {
    backgroundColor: '#DDF3E8',
  },

  textoEtiqueta: {
    fontSize: 10,
    fontWeight: 'bold',
    color: Colores.texto,
  },

  estado: {
    padding: 10,
    borderRadius: 8,
    marginTop: 14,
  },

  estadoDescargada: {
    backgroundColor: '#DDF3E8',
  },

  estadoBloqueada: {
    backgroundColor: '#FFF0D9',
  },

  estadoDisponible: {
    backgroundColor: '#E5F2F3',
  },

  textoEstado: {
    fontSize: 13,
    fontWeight: 'bold',
    color: Colores.texto,
  },

  botones: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
  },

  botonDescargar: {
    flex: 1,
    backgroundColor: Colores.primario,
    padding: 12,
    borderRadius: 9,
    alignItems: 'center',
  },

  botonEliminar: {
    backgroundColor: '#FCE8E8',
    padding: 12,
    borderRadius: 9,
    alignItems: 'center',
  },

  botonDeshabilitado: {
    opacity: 0.5,
  },

  textoBoton: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },

  textoBotonEliminar: {
    color: '#C62828',
    fontSize: 13,
    fontWeight: 'bold',
  },

  avisoPremium: {
    color: '#A56A16',
    fontSize: 12,
    marginTop: 10,
  },

  botonContenido: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },

  textoContenido: {
    color: Colores.primario,
    fontWeight: 'bold',
    fontSize: 14,
  },

  contenidoOffline: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Colores.borde,
  },

  tarjetaLugar: {
    marginBottom: 20,
  },

  imagen: {
    width: '100%',
    height: 180,
    borderRadius: 10,
  },

  nombreLugar: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colores.texto,
    marginTop: 10,
  },

  categoria: {
    color: Colores.primario,
    fontSize: 13,
    marginTop: 4,
  },

  descripcionLugar: {
    color: Colores.textoSuave,
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },

  coordenadas: {
    color: Colores.textoSuave,
    fontSize: 12,
    marginTop: 5,
  },

  imagenGaleria: {
    width: '100%',
    height: 150,
    borderRadius: 9,
    marginTop: 10,
  },

  mensaje: {
    fontSize: 12,
    color: Colores.primario,
    marginTop: 10,
  },

  textoSecundario: {
    color: Colores.textoSuave,
    fontSize: 13,
  },

  textoVacio: {
    color: Colores.textoSuave,
    textAlign: 'center',
    padding: 25,
  },

});
