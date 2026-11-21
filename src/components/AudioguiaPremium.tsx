import { StyleSheet, Text } from 'react-native';

import { Colores } from '../constants/colores';
import { obtenerContenidoPremium } from '../data';

type Props = {
  lugarId: number;
};

/**
 * VERSIÓN INICIAL del coordinador. Dueña: Persona 4 (HU-04).
 * Persona 1 la coloca en la pantalla de detalle: <AudioguiaPremium lugarId={lugar.id} />
 * TODO(Persona 4): mostrar candado si no está desbloqueada (useDesbloqueo),
 * llevar a /pago al tocarla y reproducir el audio con expo-audio si ya lo está.
 */
export function AudioguiaPremium({ lugarId }: Props) {
  const contenido = obtenerContenidoPremium(`audio-${lugarId}`);
  if (!contenido) return null;

  return (
    <Text style={styles.texto}>
      Audioguía: {contenido.titulo} (pendiente: Persona 4)
    </Text>
  );
}

const styles = StyleSheet.create({
  texto: {
    fontSize: 14,
    color: Colores.textoSuave,
    marginVertical: 8,
  },
});
