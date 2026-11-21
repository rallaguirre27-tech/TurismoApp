import AsyncStorage from '@react-native-async-storage/async-storage';

import { Ruta } from '../types/ruta';

const CLAVE_DESCARGAS = 'descargas';

/**
 * VERSIÓN INICIAL del coordinador. Dueña: Persona 3 (HU-03).
 *
 * Por ahora solo recuerda QUÉ rutas se marcaron como descargadas (sus ids).
 * TODO(Persona 3): en descargarRuta, guardar de verdad el contenido para usarlo
 * sin internet (fichas de las paradas con lugaresDeRuta(ruta), fotos y coordenadas)
 * con expo-file-system, y leerlo de ahí cuando no haya conexión.
 * Mantener estas 4 funciones con la misma firma: las usan otras pantallas.
 */

export async function listarDescargas(): Promise<number[]> {
  try {
    const valor = await AsyncStorage.getItem(CLAVE_DESCARGAS);
    return valor ? (JSON.parse(valor) as number[]) : [];
  } catch {
    return [];
  }
}

export async function estaDescargada(rutaId: number): Promise<boolean> {
  const ids = await listarDescargas();
  return ids.includes(rutaId);
}

export async function descargarRuta(ruta: Ruta): Promise<void> {
  const ids = await listarDescargas();
  if (ids.includes(ruta.id)) return;
  await AsyncStorage.setItem(CLAVE_DESCARGAS, JSON.stringify([...ids, ruta.id]));
}

export async function eliminarDescarga(rutaId: number): Promise<void> {
  const ids = await listarDescargas();
  await AsyncStorage.setItem(CLAVE_DESCARGAS, JSON.stringify(ids.filter((id) => id !== rutaId)));
}
