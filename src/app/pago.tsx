import { useLocalSearchParams } from 'expo-router';

import { PantallaPendiente } from '../components/PantallaPendiente';
import { obtenerContenidoPremium } from '../data';

export default function PagoScreen() {
  const { contenido } = useLocalSearchParams<{ contenido?: string }>();
  const encontrado = contenido ? obtenerContenidoPremium(contenido) : undefined;

  return (
    <PantallaPendiente
      historia="HU-04"
      responsable="Persona 4"
      titulo="Desbloquear contenido"
      descripcion="Flujo de pago simulado con Yape, Plin o tarjeta, y confirmación."
      datos={
        encontrado
          ? `Contenido: ${encontrado.titulo} (S/ ${encontrado.precio.toFixed(2)})`
          : 'Sin contenido seleccionado'
      }
    />
  );
}
