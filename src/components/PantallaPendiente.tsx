import { StyleSheet, Text, View } from 'react-native';

import { Colores } from '../constants/colores';

type Props = {
  historia: string;
  titulo: string;
  responsable: string;
  descripcion: string;
  /** Línea opcional que comprueba que los datos de ejemplo cargan bien */
  datos?: string;
};

/**
 * Pantalla provisional. Cada dueño reemplaza el contenido de su pantalla
 * y deja de usar este componente.
 */
export function PantallaPendiente({ historia, titulo, responsable, descripcion, datos }: Props) {
  return (
    <View style={styles.contenedor}>
      <View style={styles.tarjeta}>
        <Text style={styles.etiqueta}>
          {historia} · {responsable}
        </Text>
        <Text style={styles.titulo}>{titulo}</Text>
        <Text style={styles.descripcion}>{descripcion}</Text>
        {datos ? <Text style={styles.datos}>{datos}</Text> : null}
        <Text style={styles.pendiente}>Pendiente de construir</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: Colores.fondo,
  },
  tarjeta: {
    width: '100%',
    backgroundColor: Colores.tarjeta,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colores.borde,
    padding: 20,
  },
  etiqueta: {
    fontSize: 13,
    fontWeight: '700',
    color: Colores.primario,
    marginBottom: 6,
  },
  titulo: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colores.texto,
    marginBottom: 8,
  },
  descripcion: {
    fontSize: 15,
    color: Colores.textoSuave,
    marginBottom: 12,
  },
  datos: {
    fontSize: 14,
    color: Colores.texto,
    marginBottom: 12,
  },
  pendiente: {
    fontSize: 13,
    fontWeight: '600',
    color: Colores.secundario,
  },
});
