import { Image, Pressable, StyleSheet, Text, View } from 'react-native';

import { Colores } from '../constants/colores';
import { Lugar } from '../types/lugar';

interface LugarCardProps {
  lugar: Lugar;
  onPress: () => void;
}

export function LugarCard({ lugar, onPress }: LugarCardProps) {
  return (
    <Pressable
      style={({ pressed }) => [styles.tarjeta, pressed && styles.tarjetaPresionada]}
      onPress={onPress}
    >
      <Image source={{ uri: lugar.imagen }} style={styles.imagen} resizeMode="cover" />

      <View style={styles.contenido}>
        <View style={styles.filaSuperior}>
          <View style={styles.badgeCategoria}>
            <Text style={styles.textoCategoria}>{lugar.categoria}</Text>
          </View>
          {lugar.horario ? (
            <Text style={styles.textoHorario} numberOfLines={1}>
              🕒 {lugar.horario}
            </Text>
          ) : null}
        </View>

        <Text style={styles.nombre} numberOfLines={2}>
          {lugar.nombre}
        </Text>

        <Text style={styles.ciudad} numberOfLines={1}>
          📍 {lugar.ciudad}
        </Text>

        <Text style={styles.descripcion} numberOfLines={2}>
          {lugar.descripcion}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    backgroundColor: Colores.tarjeta,
    borderRadius: 14,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colores.borde,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  tarjetaPresionada: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },
  imagen: {
    width: '100%',
    height: 170,
    backgroundColor: Colores.borde,
  },
  contenido: {
    padding: 14,
  },
  filaSuperior: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    gap: 8,
  },
  badgeCategoria: {
    backgroundColor: Colores.primario,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  textoCategoria: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  textoHorario: {
    fontSize: 12,
    color: Colores.textoSuave,
    flexShrink: 1,
  },
  nombre: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colores.texto,
    marginBottom: 4,
  },
  ciudad: {
    fontSize: 13,
    fontWeight: '600',
    color: Colores.secundario,
    marginBottom: 6,
  },
  descripcion: {
    fontSize: 14,
    color: Colores.textoSuave,
    lineHeight: 20,
  },
});
