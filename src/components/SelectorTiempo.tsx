import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Colores } from '../constants/colores';
import { useDesbloqueo } from '../context/DesbloqueoContext';
import { Ruta } from '../types/ruta';

type Opcion = { etiqueta: string; minutos: number };

/** Tiempos que puede elegir el visitante. `Infinity` = sin límite de tiempo. */
const OPCIONES: Opcion[] = [
  { etiqueta: '1 h', minutos: 60 },
  { etiqueta: '2 h', minutos: 120 },
  { etiqueta: '3 h', minutos: 180 },
  { etiqueta: 'Todo el día', minutos: Infinity },
];

/** 45 → "45 min", 60 → "1 h", 90 → "1 h 30 min". */
export function formatearDuracion(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const resto = minutos % 60;
  if (horas === 0) return `${resto} min`;
  if (resto === 0) return `${horas} h`;
  return `${horas} h ${resto} min`;
}

type Props = {
  rutas: Ruta[];
  /** Se llama al tocar una ruta. La pantalla decide si abre la ruta o el pago. */
  onElegirRuta: (ruta: Ruta) => void;
};

/** El visitante elige cuánto tiempo tiene y ve solo las rutas que caben en él. */
export function SelectorTiempo({ rutas, onElegirRuta }: Props) {
  const { estaDesbloqueado } = useDesbloqueo();
  const [minutos, setMinutos] = useState<number>(Infinity);

  const rutasQueCaben = rutas
    .filter((ruta) => ruta.duracionMin <= minutos)
    .sort((a, b) => a.duracionMin - b.duracionMin);

  return (
    <View>
      <Text style={styles.titulo}>¿Cuánto tiempo tienes?</Text>

      <View style={styles.opciones}>
        {OPCIONES.map((opcion) => {
          const activa = opcion.minutos === minutos;
          return (
            <Pressable
              key={opcion.etiqueta}
              onPress={() => setMinutos(opcion.minutos)}
              accessibilityRole="button"
              accessibilityState={{ selected: activa }}
              accessibilityLabel={`Tiempo disponible: ${opcion.etiqueta}`}
              style={[styles.opcion, activa && styles.opcionActiva]}
            >
              <Text style={[styles.opcionTexto, activa && styles.opcionTextoActivo]}>
                {opcion.etiqueta}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {rutasQueCaben.length === 0 ? (
        <Text style={styles.vacio}>
          No hay rutas que quepan en ese tiempo. Prueba con más tiempo.
        </Text>
      ) : (
        rutasQueCaben.map((ruta) => {
          const bloqueada = ruta.premium && !estaDesbloqueado(`ruta-${ruta.id}`);
          return (
            <Pressable
              key={ruta.id}
              onPress={() => onElegirRuta(ruta)}
              accessibilityRole="button"
              accessibilityLabel={`Abrir ${ruta.nombre}`}
              style={({ pressed }) => [styles.tarjeta, pressed && styles.presionada]}
            >
              <Ionicons name="walk" size={24} color={Colores.primario} />
              <View style={styles.tarjetaTexto}>
                <Text style={styles.nombre}>{ruta.nombre}</Text>
                <Text style={styles.detalle}>
                  {formatearDuracion(ruta.duracionMin)} · {ruta.paradas.length} paradas
                  {ruta.premium ? (bloqueada ? ' · Premium' : ' · Premium desbloqueada') : ''}
                </Text>
              </View>
              <Ionicons
                name={bloqueada ? 'lock-closed' : 'chevron-forward'}
                size={20}
                color={bloqueada ? Colores.secundario : Colores.textoSuave}
              />
            </Pressable>
          );
        })
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  titulo: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colores.texto,
    marginBottom: 10,
  },
  opciones: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
  },
  opcion: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: Colores.primario,
    backgroundColor: Colores.tarjeta,
  },
  opcionActiva: {
    backgroundColor: Colores.primario,
  },
  opcionTexto: {
    fontSize: 14,
    fontWeight: '600',
    color: Colores.primario,
  },
  opcionTextoActivo: {
    color: '#FFFFFF',
  },
  vacio: {
    fontSize: 14,
    color: Colores.textoSuave,
    paddingVertical: 8,
  },
  tarjeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colores.borde,
    backgroundColor: Colores.fondo,
  },
  presionada: {
    opacity: 0.85,
  },
  tarjetaTexto: {
    flex: 1,
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colores.texto,
  },
  detalle: {
    fontSize: 13,
    color: Colores.textoSuave,
    marginTop: 2,
  },
});