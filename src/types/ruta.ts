export interface Ruta {
  id: number;
  nombre: string;
  descripcion: string;
  /** Duración total a pie, en minutos */
  duracionMin: number;
  /** Ids de los lugares (src/data/lugares.json), en el orden de la visita */
  paradas: number[];
  /** true = contenido de pago (HU-04). Su id de desbloqueo es `ruta-<id>` */
  premium: boolean;
}
