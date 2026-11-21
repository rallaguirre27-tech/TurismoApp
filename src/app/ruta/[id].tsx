import { useLocalSearchParams } from 'expo-router';

import { PantallaPendiente } from '../../components/PantallaPendiente';

export default function RutaScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <PantallaPendiente
      historia="HU-02"
      responsable="Persona 2"
      titulo="Detalle de la ruta"
      descripcion="Paradas en orden, duración y trazado de la ruta a pie."
      datos={`Ruta con id: ${id}`}
    />
  );
}
