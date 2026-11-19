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
  /** URL de la foto (https://...) */
  imagen: string;
  latitud: number;
  longitud: number;
  horario?: string;
}
