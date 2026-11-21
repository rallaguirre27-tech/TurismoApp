# Guía del equipo – TurismoApp (Huamanga)

Cada persona construye **una historia de usuario** en **archivos propios**, para no pisarse el trabajo en GitHub.

## Estructura

Todo el código vive dentro de `src/`:

- `src/app/` → pantallas (cada archivo es una ruta)
- `src/components/` → componentes reutilizables
- `src/context/` → estado global (favoritos, desbloqueo)
- `src/services/` → lógica sin pantalla (descargas)
- `src/data/` → JSON con los datos y `index.ts` para leerlos
- `src/types/` → formato de los datos (`Lugar`, `Ruta`, `Comercio`, `ContenidoPremium`)
- `src/constants/` → colores

## Reparto de historias

| Persona | Historia | Rama | Archivos propios |
|---|---|---|---|
| 1 | HU-01 Catálogo e información cultural | `hu01-catalogo` | `src/data/lugares.json`, `src/app/(tabs)/index.tsx`, `src/app/lugar/[id].tsx`, `src/components/LugarCard.tsx` |
| 2 | HU-02 Mapa interactivo y rutas autoguiadas | `hu02-mapa` | `src/data/rutas.json`, `src/app/(tabs)/mapa.tsx`, `src/app/ruta/[id].tsx`, `src/components/SelectorTiempo.tsx` |
| 3 | HU-03 Descarga sin conexión | `hu03-offline` | `src/services/descargas.ts`, `src/app/(tabs)/descargas.tsx`, `src/components/BannerSinConexion.tsx` |
| 4 | HU-04 Desbloqueo freemium (Yape/Plin) | `hu04-freemium` | `src/context/DesbloqueoContext.tsx`, `src/app/pago.tsx`, `src/components/AudioguiaPremium.tsx`, `src/components/CandadoPremium.tsx`, `src/data/contenidoPremium.json` |
| 5 | HU-05 Directorio de comercios aliados | `hu05-comercios` | `src/data/comercios.json`, `src/app/(tabs)/comercios.tsx`, `src/app/comercio/[id].tsx`, `src/components/ComercioCard.tsx` |

Puedes **crear archivos nuevos** en `components/` o `services/` para tu historia, pero **no modifiques archivos de otra persona**. Si necesitas un cambio en un archivo ajeno, pídeselo a su dueño.

### Solo el coordinador modifica

`src/app/_layout.tsx`, `src/app/(tabs)/_layout.tsx`, `src/types/*`, `src/data/index.ts`, `src/components/PantallaPendiente.tsx`, `src/components/BotonComoLlegar.tsx`, `package.json`, `app.json`.

Si necesitas una librería nueva o un campo nuevo en un tipo, pídelo al coordinador.

## Pantallas pendientes

Las pantallas que aún no están hechas muestran una tarjeta "Pendiente de construir". Reemplaza **todo el contenido de tu pantalla** y deja de usar `PantallaPendiente`.

## Cómo leer los datos

```tsx
import { lugares, rutas, comercios, obtenerLugarPorId, lugaresDeRuta } from '../data';
import { useFavoritos } from '../context/FavoritosContext';
import { useDesbloqueo } from '../context/DesbloqueoContext';
```

Ajusta `../data` según la carpeta donde esté tu archivo (`../../data` dentro de `app/(tabs)/` o `app/lugar/`).

## Acuerdos entre historias (contratos)

1. **Ids estables.** Persona 1 no cambia ni renumera los `id` de `lugares.json` una vez publicados: las rutas (`paradas`) y el contenido premium dependen de ellos.
2. **Rutas premium.** Persona 2 marca `"premium": true` en `rutas.json`. Persona 4 crea en `contenidoPremium.json` una entrada con id `ruta-<id>` por cada ruta premium.
3. **Candado.** Antes de abrir una ruta premium:
   ```tsx
   const { estaDesbloqueado } = useDesbloqueo();
   if (ruta.premium && !estaDesbloqueado(`ruta-${ruta.id}`)) {
     router.push({ pathname: '/pago', params: { contenido: `ruta-${ruta.id}` } });
   }
   ```
4. **Audioguía.** Persona 1 coloca `<AudioguiaPremium lugarId={lugar.id} />` en la pantalla de detalle. El componente es de Persona 4.
5. **Cómo llegar.** Todos usan `<BotonComoLlegar latitud={...} longitud={...} />` (ya está hecho, no se reescribe).
6. **Descargas.** Persona 3 mantiene las 4 funciones de `descargas.ts` (`listarDescargas`, `estaDescargada`, `descargarRuta`, `eliminarDescarga`). Persona 2 puede usarlas para poner un botón "Descargar" en el detalle de la ruta.
7. **Navegación entre pantallas:** `/lugar/<id>`, `/ruta/<id>`, `/comercio/<id>` y `/pago`.

## Flujo de trabajo

```bash
git clone https://github.com/USUARIO/TurismoApp.git
cd TurismoApp
npm install
git checkout -b nombre-de-tu-rama      # ver tabla de arriba
npx expo start

# al terminar un avance:
git add .
git commit -m "HU-0X: descripción del cambio"
git push -u origin nombre-de-tu-rama
```

Luego abre un **Pull Request** en GitHub hacia `main`.

## Reglas

1. Antes de empezar cada día: `git pull origin main`.
2. Nunca subas directo a `main`: siempre Pull Request.
3. Commits claros, por ejemplo `HU-05: agrega filtro por tipo de comercio`.
4. No subas claves ni archivos `.env`.
5. Prueba tu pantalla en el celular antes de abrir el Pull Request.

## Orden sugerido para unir los Pull Requests

1. HU-01 (datos base), 2. HU-02 y HU-05 (no dependen de nadie), 3. HU-04, 4. HU-03.

## Datos de ejemplo

Los JSON traen datos marcados como `EJEMPLO` para que todos puedan probar desde el primer día. Cada dueño los reemplaza por datos reales y **verifica las coordenadas en Google Maps** (clic derecho sobre el lugar).
