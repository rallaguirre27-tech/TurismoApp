import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { AudioguiaPremium } from '../../components/AudioguiaPremium';
import { BotonComoLlegar } from '../../components/BotonComoLlegar';
import { Colores } from '../../constants/colores';
import { obtenerLugarPorId } from '../../data';

export default function DetalleLugarScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const lugar = obtenerLugarPorId(Number(id));
  const [indiceFoto, setIndiceFoto] = useState(0);

  const fotosExtras =
    lugar?.galeria && lugar.galeria.length > 0
      ? lugar.galeria
      : lugar
      ? [lugar.imagen]
      : [];

  useEffect(() => {
    setIndiceFoto(0);
  }, [id]);

  useEffect(() => {
    if (fotosExtras.length <= 1) return;
    const intervalo = setInterval(() => {
      setIndiceFoto((prev) => (prev + 1) % fotosExtras.length);
    }, 3000);
    return () => clearInterval(intervalo);
  }, [fotosExtras.length]);

  if (!lugar) {
    return (
      <View style={styles.contenedorCentrado}>
        <Stack.Screen options={{ title: 'Lugar no encontrado' }} />
        <Text style={styles.tituloError}>No se encontró el atractivo turístico</Text>
        <Pressable style={styles.botonVolver} onPress={() => router.back()}>
          <Text style={styles.textoBotonVolver}>Volver al catálogo</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.contenedor} contentContainerStyle={styles.contenidoScroll}>
      <Stack.Screen options={{ title: lugar.nombre }} />

      <View style={styles.contenedorGaleria}>
        <Image
          source={{ uri: fotosExtras[indiceFoto] }}
          style={styles.imagenGrande}
          resizeMode="cover"
        />

        {fotosExtras.length > 1 ? (
          <View style={styles.barraGaleria}>
            <Text style={styles.contadorFotos}>
              Foto {indiceFoto + 1} de {fotosExtras.length}
            </Text>
            <View style={styles.indicadores}>
              {fotosExtras.map((_, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setIndiceFoto(idx)}
                  style={[
                    styles.punto,
                    indiceFoto === idx && styles.puntoActivo,
                  ]}
                />
              ))}
            </View>
          </View>
        ) : null}
      </View>

      <View style={styles.cuerpo}>
        <View style={styles.filaMeta}>
          <View style={styles.badgeCategoria}>
            <Text style={styles.textoCategoria}>{lugar.categoria}</Text>
          </View>
          <Text style={styles.ciudad}>📍 {lugar.ciudad}</Text>
        </View>

        <Text style={styles.titulo}>{lugar.nombre}</Text>

        {lugar.horario ? (
          <View style={styles.tarjetaInfo}>
            <Text style={styles.etiquetaSeccion}>🕒 Horario de atención</Text>
            <Text style={styles.textoSeccion}>{lugar.horario}</Text>
          </View>
        ) : null}

        <View style={styles.tarjetaInfo}>
          <Text style={styles.etiquetaSeccion}>📖 Historia y descripción cultural</Text>
          <Text style={styles.textoSeccion}>{lugar.descripcion}</Text>
        </View>

        <View style={styles.tarjetaInfo}>
          <Text style={styles.etiquetaSeccion}>🎒 Recomendaciones para la visita</Text>
          <Text style={styles.textoSeccion}>
            • Llevar documento de identidad, agua y protector solar.{'\n'}
            • Usar calzado cómodo o de caminata según el terreno.{'\n'}
            • Respetar la señalización y conservación del patrimonio cultural y natural.
          </Text>
        </View>

        <View style={styles.seccionAudioguia}>
          <Text style={styles.etiquetaSeccion}>🎧 Experiencia guiada</Text>
          <AudioguiaPremium lugarId={lugar.id} />
        </View>

        <View style={styles.seccionBoton}>
          <BotonComoLlegar
            latitud={lugar.latitud}
            longitud={lugar.longitud}
            etiqueta="Cómo llegar con Google Maps"
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: Colores.fondo,
  },
  contenidoScroll: {
    paddingBottom: 32,
  },
  contenedorCentrado: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colores.fondo,
  },
  tituloError: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colores.texto,
    marginBottom: 16,
    textAlign: 'center',
  },
  botonVolver: {
    backgroundColor: Colores.primario,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  textoBotonVolver: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 15,
  },
  contenedorGaleria: {
    position: 'relative',
    backgroundColor: Colores.borde,
  },
  imagenGrande: {
    width: '100%',
    height: 250,
  },
  barraGaleria: {
    position: 'absolute',
    bottom: 10,
    left: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contadorFotos: {
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  indicadores: {
    flexDirection: 'row',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  punto: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
  },
  puntoActivo: {
    backgroundColor: '#FFFFFF',
    width: 16,
  },
  cuerpo: {
    padding: 18,
  },
  filaMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 8,
  },
  badgeCategoria: {
    backgroundColor: Colores.primario,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  textoCategoria: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  ciudad: {
    fontSize: 14,
    fontWeight: '600',
    color: Colores.secundario,
    flexShrink: 1,
  },
  titulo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colores.texto,
    marginBottom: 16,
    lineHeight: 30,
  },
  tarjetaInfo: {
    backgroundColor: Colores.tarjeta,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colores.borde,
  },
  etiquetaSeccion: {
    fontSize: 15,
    fontWeight: '700',
    color: Colores.texto,
    marginBottom: 6,
  },
  textoSeccion: {
    fontSize: 14,
    color: Colores.textoSuave,
    lineHeight: 21,
  },
  seccionAudioguia: {
    backgroundColor: Colores.tarjeta,
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colores.secundario,
  },
  seccionBoton: {
    marginTop: 4,
  },
});
