export const tiposComercio = [
  'Restaurante',
  'Cafetería',
  'Hospedaje',
  'Taller artesanal',
] as const;

export type TipoComercio = (typeof tiposComercio)[number];

export interface Comercio {
  id: number;
  nombre: string;
  tipo: TipoComercio;
  descripcion: string;
  direccion: string;
  /** Con código de país si es posible, por ejemplo +51 966 000 000 */
  telefono?: string;
  /** Solo dígitos con código de país, por ejemplo 51966000000 */
  whatsapp?: string;
  horario?: string;
  /** URL de la foto (https://...) */
  imagen: string;
  latitud: number;
  longitud: number;
}
