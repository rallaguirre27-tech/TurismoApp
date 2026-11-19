# Guía del equipo – TurismoApp

## Estructura

Todo el código vive dentro de `src/`:

- `src/app/` → pantallas
- `src/components/` → componentes reutilizables
- `src/context/` → estado global (favoritos)
- `src/data/` → `lugares.json`, `categorias.ts` y `index.ts`
- `src/types/` → tipos (`Lugar`, `Categoria`)
- `src/constants/` → colores

## Cómo usar los datos y los favoritos

```tsx
import { lugares, obtenerLugarPorId } from '../data';
import { categorias } from '../data/categorias';
import { useFavoritos } from '../context/FavoritosContext';

const { esFavorito, alternarFavorito, favoritos } = useFavoritos();
```

Formato de un lugar: ver `src/types/lugar.ts`. La imagen se guarda como **URL (https)**.

## Reparto de archivos

| Persona | Archivos propios |
|---|---|
| 1. Datos y ubicación | `src/data/lugares.json`, `src/data/categorias.ts`, `src/app/(tabs)/mapa.tsx`, `src/components/BotonComoLlegar.tsx` |
| 2. Inicio y búsqueda | `src/app/(tabs)/index.tsx`, `src/components/LugarCard.tsx`, `src/components/Buscador.tsx`, `src/components/FiltroCategorias.tsx` |
| 3. Favoritos | `src/context/FavoritosContext.tsx`, `src/app/(tabs)/favoritos.tsx`, `src/components/BotonFavorito.tsx` |
| 4. Detalle y pulido | `src/app/lugar/[id].tsx`, `app.json`, `README.md`, ícono y splash en `assets/` |

Los archivos de navegación (`_layout.tsx`), `package.json` y `src/types/` los modifica solo el coordinador.

## Reglas

1. Editar **solo tus archivos**. Si necesitas un cambio en otro, pídelo a su dueño.
2. Antes de empezar: `git pull origin main`.
3. Cada persona trabaja en su rama y une con **Pull Request**, nunca directo a `main`.
4. Mensajes de commit claros, por ejemplo: `Inicio: agrega tarjeta de lugar`.
5. No subir claves ni archivos `.env`.

## Flujo de trabajo

```bash
git clone https://github.com/USUARIO/TurismoApp.git
cd TurismoApp
npm install
git checkout -b nombre-de-tu-rama
npx expo start

# al terminar:
git add .
git commit -m "Descripción del cambio"
git push -u origin nombre-de-tu-rama
```

Luego abre el Pull Request en GitHub.
