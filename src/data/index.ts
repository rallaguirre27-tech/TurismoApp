import { Lugar } from '../types/lugar';
import datos from './lugares.json';

export const lugares: Lugar[] = datos as Lugar[];

export function obtenerLugarPorId(id: number): Lugar | undefined {
  return lugares.find((lugar) => lugar.id === id);
}
