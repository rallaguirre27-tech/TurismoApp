import { useLocalSearchParams } from 'expo-router';

import { PantallaPendiente } from '../../components/PantallaPendiente';

export default function ComercioScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <PantallaPendiente
      historia="HU-05"
      responsable="Persona 5"
      titulo="Detalle del comercio"
      descripcion="Foto, descripción, horario, botón de llamar y botón Cómo llegar."
      datos={`Comercio con id: ${id}`}
    />
  );
}
