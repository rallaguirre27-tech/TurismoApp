import { PantallaPendiente } from '../../components/PantallaPendiente';
import { comercios } from '../../data';

export default function ComerciosScreen() {
  return (
    <PantallaPendiente
      historia="HU-05"
      responsable="Persona 5"
      titulo="Directorio de comercios aliados"
      descripcion="Lista de restaurantes, cafeterías, hospedajes y talleres, con filtro por tipo."
      datos={`${comercios.length} comercios de ejemplo cargados`}
    />
  );
}
