# Turismo Ayacucho (`TurismoApp`)

Aplicación móvil turística interactiva para la región de **Ayacucho, Perú**, desarrollada como Producto Mínimo Viable (MVP) para el curso **Innovación Tecnológica, Creatividad y Emprendimiento (IS-386)** de la Universidad Nacional de San Cristóbal de Huamanga (UNSCH).

---

## Características Principales

- **Catálogo de Destinos Turísticos:** Exploración de los principales atractivos culturales, históricos y naturales de Ayacucho con fotografía, horario de atención y descripción detallada.
- **Mapa Interactivo con Marcadores:** Visualización geolocalizada de los puntos de interés turísticos.
- **Navegación Directa ("Cómo llegar"):** Integración con aplicaciones nativas de mapas (Google Maps / Apple Maps) mediante coordenadas GPS.
- **Gestión de Favoritos:** Guardado local persistente (`AsyncStorage`) para que el viajero organice su propio itinerario sin perder sus destinos seleccionados.
- **Búsqueda y Filtros por Categoría:** Filtrado rápido por nombre y temática turística.

---

## Stack Tecnológico

- **Framework:** React Native + Expo (SDK con Expo Router)
- **Lenguaje:** TypeScript
- **Almacenamiento Local:** `@react-native-async-storage/async-storage`
- **Enrutamiento:** `expo-router` (navegación basada en archivos y pestañas)

---

## Instalación y Ejecución Local

1. **Clonar el repositorio:**
   ```bash
   git clone [https://github.com/rallaguirre27-tech/TurismoApp.git](https://github.com/rallaguirre27-tech/TurismoApp.git)
   cd TurismoApp
   