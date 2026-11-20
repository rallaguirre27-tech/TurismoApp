import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Colores } from '../../constants/colores';
import lugaresData from '../../data/lugares.json';

export interface Lugar {
  id: number;
  nombre: string;
  categoria: string;
  ciudad: string;
  descripcion: string;
  imagen: string;
  latitud: number;
  longitud: number;
  horario?: string;
}

export default function DetalleLugarScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const router = useRouter();
  const [favoritoLocal, setFavoritoLocal] = useState(false);

  const lugares = lugaresData as Lugar[];
  const lugar = lugares.find((item) => String(item.id) === String(id));

  const handleComoLlegar = async () => {
    if (!lugar) return;

    const label = encodeURIComponent(lugar.nombre);
    const url =
      Platform.OS === 'ios'
        ? `http://maps.apple.com/?ll=${lugar.latitud},${lugar.longitud}&q=${label}`
        : `geo:${lugar.latitud},${lugar.longitud}?q=${lugar.latitud},${lugar.longitud}(${label})`;

    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        const webUrl = `https://www.google.com/maps/search/?api=1&query=${lugar.latitud},${lugar.longitud}`;
        await Linking.openURL(webUrl);
      }
    } catch {
      Alert.alert(
        'Error al abrir el mapa',
        'No fue posible iniciar la aplicación de mapas en este dispositivo.'
      );
    }
  };

  if (!lugar) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.notFoundTitle}>Lugar no encontrado</Text>
        <Text style={styles.notFoundText}>
          No pudimos localizar la información del destino solicitado.
        </Text>
        <Pressable style={styles.primaryButton} onPress={() => router.back()}>
          <Text style={styles.primaryButtonText}>Volver</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: lugar.imagen }} style={styles.heroImage} resizeMode="cover" />
      </View>

      <View style={styles.body}>
        <View style={styles.badgesRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{lugar.categoria}</Text>
          </View>
          <Text style={styles.cityText}>{lugar.ciudad}</Text>
        </View>

        <Text style={styles.title}>{lugar.nombre}</Text>

        {lugar.horario ? (
          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Horario de atención</Text>
            <Text style={styles.infoValue}>{lugar.horario}</Text>
          </View>
        ) : null}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Descripción</Text>
          <Text style={styles.description}>{lugar.descripcion}</Text>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Coordenadas</Text>
          <Text style={styles.infoValue}>
            {lugar.latitud.toFixed(4)}, {lugar.longitud.toFixed(4)}
          </Text>
        </View>

        <View style={styles.actionsRow}>
          <Pressable
            style={[styles.secondaryButton, favoritoLocal && styles.secondaryButtonActive]}
            onPress={() => setFavoritoLocal((prev) => !prev)}
          >
            <Text
              style={[
                styles.secondaryButtonText,
                favoritoLocal && styles.secondaryButtonTextActive,
              ]}
            >
              {favoritoLocal ? '♥ En favoritos' : '♡ Favorito'}
            </Text>
          </Pressable>

          <Pressable style={styles.primaryButton} onPress={handleComoLlegar}>
            <Text style={styles.primaryButtonText}>Cómo llegar</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colores.fondo,
  },
  content: {
    paddingBottom: 32,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colores.fondo,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  notFoundTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: Colores.texto,
    marginBottom: 8,
  },
  notFoundText: {
    fontSize: 15,
    color: Colores.textoSuave,
    textAlign: 'center',
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    width: '100%',
    height: 270,
    backgroundColor: Colores.borde,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  backChip: {
    position: 'absolute',
    top: 44,
    left: 16,
    backgroundColor: 'rgba(31, 41, 51, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  backChipText: {
    color: Colores.tarjeta,
    fontSize: 14,
    fontWeight: '600',
  },
  body: {
    padding: 20,
  },
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    backgroundColor: Colores.secundario + '26',
    borderWidth: 1,
    borderColor: Colores.secundario,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  badgeText: {
    color: Colores.texto,
    fontSize: 13,
    fontWeight: '600',
  },
  cityText: {
    fontSize: 14,
    color: Colores.textoSuave,
    fontWeight: '500',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: Colores.texto,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colores.texto,
    marginBottom: 6,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    color: Colores.textoSuave,
  },
  infoBox: {
    backgroundColor: Colores.tarjeta,
    borderWidth: 1,
    borderColor: Colores.borde,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colores.textoSuave,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Colores.texto,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  secondaryButton: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colores.borde,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colores.tarjeta,
  },
  secondaryButtonActive: {
    borderColor: Colores.secundario,
    backgroundColor: Colores.secundario + '1A',
  },
  secondaryButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: Colores.texto,
  },
  secondaryButtonTextActive: {
    color: Colores.primario,
  },
  primaryButton: {
    flex: 1.4,
    backgroundColor: Colores.primario,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colores.tarjeta,
  },
});
