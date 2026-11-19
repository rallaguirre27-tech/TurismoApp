import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

const CLAVE_FAVORITOS = 'favoritos';

type FavoritosContextoTipo = {
  /** Ids de los lugares marcados como favoritos */
  favoritos: number[];
  /** true mientras se leen los favoritos guardados */
  cargando: boolean;
  esFavorito: (id: number) => boolean;
  alternarFavorito: (id: number) => void;
};

const FavoritosContext = createContext<FavoritosContextoTipo | undefined>(undefined);

export function FavoritosProvider({ children }: { children: ReactNode }) {
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_FAVORITOS)
      .then((valor) => {
        if (valor) setFavoritos(JSON.parse(valor));
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const alternarFavorito = useCallback(
    (id: number) => {
      const nuevos = favoritos.includes(id)
        ? favoritos.filter((favorito) => favorito !== id)
        : [...favoritos, id];
      setFavoritos(nuevos);
      AsyncStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(nuevos)).catch(() => {});
    },
    [favoritos],
  );

  const esFavorito = useCallback((id: number) => favoritos.includes(id), [favoritos]);

  return (
    <FavoritosContext.Provider value={{ favoritos, cargando, esFavorito, alternarFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
}

export function useFavoritos() {
  const contexto = useContext(FavoritosContext);
  if (!contexto) {
    throw new Error('useFavoritos debe usarse dentro de FavoritosProvider');
  }
  return contexto;
}
