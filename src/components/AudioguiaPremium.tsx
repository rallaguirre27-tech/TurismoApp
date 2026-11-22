
import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';
import {
  useAudioPlayer,
  useAudioPlayerStatus,
} from 'expo-audio';

import { Colores } from '../constants/colores';
import { obtenerContenidoPremium } from '../data';
import { useDesbloqueo } from '../context/DesbloqueoContext';

type Props = {
  lugarId: number;
};

// Cada archivo se registra de forma estática para que Expo pueda incluirlo.
function obtenerArchivoAudio(lugarId: number) {
  switch (lugarId) {
    case 1:
      return require('../../assets/audios/audioguia-lugar-1.mp3');
    case 2:
      return require('../../assets/audios/audioguia-lugar-2.mp3');
    case 3:
      return require('../../assets/audios/audioguia-lugar-3.mp3');
    case 4:
      return require('../../assets/audios/audioguia-lugar-4.mp3');
    default:
      return null;
  }
}

export function AudioguiaPremium({ lugarId }: Props) {
  const contenido = obtenerContenidoPremium(`audio-${lugarId}`);
  const { estaDesbloqueado, cargando } = useDesbloqueo();
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
  }, []);

  if (!contenido) return null;

  const desbloqueada = estaDesbloqueado(contenido.id);

  if (cargando) {
    return <Text style={styles.texto}>Verificando acceso...</Text>;
  }

  if (!desbloqueada) {
    return (
        <View style={styles.contenedor}>
          <Text style={styles.titulo}>{contenido.titulo}</Text>
          <Text style={styles.descripcion}>{contenido.descripcion}</Text>

          <Pressable
              style={styles.botonBloqueado}
              onPress={() =>
                  router.push({
                    pathname: '/pago',
                    params: { contenido: contenido.id },
                  })
              }
          >
            <Text style={styles.textoBoton}>
              🔒 Desbloquear audioguía - S/ {contenido.precio.toFixed(2)}
            </Text>
          </Pressable>
        </View>
    );
  }

  if (!montado) {
    return <Text style={styles.texto}>Preparando reproductor...</Text>;
  }

  return (
      <ReproductorAudio
          lugarId={lugarId}
          titulo={contenido.titulo}
          descripcion={contenido.descripcion}
      />
  );
}

function ReproductorAudio({
                            lugarId,
                            titulo,
                            descripcion,
                          }: {
  lugarId: number;
  titulo: string;
  descripcion: string;
}) {
  const archivo = obtenerArchivoAudio(lugarId);

  const player = useAudioPlayer(archivo);
  const estado = useAudioPlayerStatus(player);

  if (!archivo) {
    return <Text style={styles.texto}>No se encontró el archivo de audio.</Text>;
  }

  function alternarReproduccion() {
    if (estado.playing) {
      player.pause();
    } else {
      if (estado.duration > 0 && estado.currentTime >= estado.duration) {
        player.seekTo(0);
      }
      player.play();
    }
  }

  return (
      <View style={styles.contenedor}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>

        <View style={styles.contenedorDesbloqueado}>
          <Text style={styles.textoDesbloqueado}>
            🔓 Audioguía desbloqueada
          </Text>

          {estado.isBuffering ? (
              <Text style={styles.texto}>Cargando audio...</Text>
          ) : (
              <Pressable
                  style={styles.botonReproducir}
                  onPress={alternarReproduccion}
              >
                <Text style={styles.textoBoton}>
                  {estado.playing ? '⏸ Pausar audio' : '▶ Reproducir audio'}
                </Text>
              </Pressable>
          )}

          {estado.error ? (
              <Text style={styles.error}>
                No se pudo reproducir el audio. Comprueba el archivo MP3.
              </Text>
          ) : null}
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    backgroundColor: Colores.tarjeta,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colores.borde,
    marginVertical: 8,
  },
  titulo: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colores.texto,
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 14,
    color: Colores.textoSuave,
    marginBottom: 12,
  },
  botonBloqueado: {
    backgroundColor: Colores.primario,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  botonReproducir: {
    backgroundColor: Colores.primario,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  textoBoton: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  texto: {
    color: Colores.textoSuave,
    marginTop: 8,
  },
  contenedorDesbloqueado: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
  },
  textoDesbloqueado: {
    color: '#287A45',
    fontWeight: 'bold',
  },
  error: {
    color: '#B91C1C',
    marginTop: 8,
  },
});
