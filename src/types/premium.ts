export interface ContenidoPremium {
  /** Convención: `ruta-<id de la ruta>` o `audio-<id del lugar>` */
  id: string;
  tipo: 'ruta' | 'audioguia';
  titulo: string;
  descripcion: string;
  /** Precio en soles */
  precio: number;
  rutaId?: number;
  lugarId?: number;
  audioUrl?: string;
}
