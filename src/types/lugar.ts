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
  /** Resumen corto (1 o 2 líneas), para las tarjetas */
  descripcion: string;
  /** Historia y valor cultural del lugar */
  historia: string;
  /** Consejos para el visitante */
  recomendaciones: string[];
  /** URL de la foto (https://...) */
  imagen: string;
  latitud: number;
  longitud: number;
  horario: string;
}
