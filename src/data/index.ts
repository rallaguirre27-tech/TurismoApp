import { Comercio } from '../types/comercio';
import { Lugar } from '../types/lugar';
import { ContenidoPremium } from '../types/premium';
import { Ruta } from '../types/ruta';
import comerciosJson from './comercios.json';
import contenidoPremiumJson from './contenidoPremium.json';
import lugaresJson from './lugares.json';
import rutasJson from './rutas.json';

export const lugares: Lugar[] = lugaresJson as Lugar[];
export const rutas: Ruta[] = rutasJson as Ruta[];
export const comercios: Comercio[] = comerciosJson as Comercio[];
export const contenidosPremium: ContenidoPremium[] = contenidoPremiumJson as ContenidoPremium[];

export function obtenerLugarPorId(id: number): Lugar | undefined {
  return lugares.find((lugar) => lugar.id === id);
}

export function obtenerRutaPorId(id: number): Ruta | undefined {
  return rutas.find((ruta) => ruta.id === id);
}

export function obtenerComercioPorId(id: number): Comercio | undefined {
  return comercios.find((comercio) => comercio.id === id);
}

export function obtenerContenidoPremium(id: string): ContenidoPremium | undefined {
  return contenidosPremium.find((contenido) => contenido.id === id);
}

/** Lugares de una ruta, en el orden de la visita */
export function lugaresDeRuta(ruta: Ruta): Lugar[] {
  return ruta.paradas
    .map((id) => obtenerLugarPorId(id))
    .filter((lugar): lugar is Lugar => lugar !== undefined);
}
