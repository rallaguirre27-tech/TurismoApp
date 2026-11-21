import { PantallaPendiente } from '../../components/PantallaPendiente';
import { rutas } from '../../data';

export default function DescargasScreen() {
  return (
    <PantallaPendiente
      historia="HU-03"
      responsable="Persona 3"
      titulo="Contenido sin conexión"
      descripcion="Rutas y fichas descargadas, con aviso cuando no hay internet."
      datos={`${rutas.length} rutas de ejemplo disponibles para descargar`}
    />
  );
}
