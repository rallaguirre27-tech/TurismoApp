export type Categoria =
  | 'Naturaleza'
  | 'Historia'
  | 'Gastronomía'
  | 'Aventura'
  | 'Cultura';

export interface Lugar {
  id: number;
  nombre: string;
  categoria: Categoria;
  ciudad: string;
  descripcion: string;
  
  /** URL de la foto (https://portal.andina.pe/EDPfotografia3/Thumbnail/2024/04/24/001058672W.webp) */
  imagen: string;
  /** URLs adicionales para la galería del detalle */
  galeria?: string[];
  latitud: number;
  longitud: number;
  horario?: string;
}