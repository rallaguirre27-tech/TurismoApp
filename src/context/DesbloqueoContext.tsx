import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';

const CLAVE_DESBLOQUEADOS = 'desbloqueados';

type DesbloqueoContextoTipo = {
  /** Ids del contenido premium ya desbloqueado (ver src/types/premium.ts) */
  desbloqueados: string[];
  /** true mientras se lee lo guardado en el celular */
  cargando: boolean;
  estaDesbloqueado: (id: string) => boolean;
  desbloquear: (id: string) => void;
};

const DesbloqueoContext = createContext<DesbloqueoContextoTipo | undefined>(undefined);

/**
 * VERSIÓN INICIAL del coordinador. Dueña: Persona 4 (HU-04).
 * Ya guarda el desbloqueo en AsyncStorage; Persona 4 la mejora si hace falta.
 */
export function DesbloqueoProvider({ children }: { children: ReactNode }) {
  const [desbloqueados, setDesbloqueados] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(CLAVE_DESBLOQUEADOS)
      .then((valor) => {
        if (valor) setDesbloqueados(JSON.parse(valor));
      })
      .catch(() => {})
      .finally(() => setCargando(false));
  }, []);

  const desbloquear = useCallback(
    (id: string) => {
      if (desbloqueados.includes(id)) return;
      const nuevos = [...desbloqueados, id];
      setDesbloqueados(nuevos);
      AsyncStorage.setItem(CLAVE_DESBLOQUEADOS, JSON.stringify(nuevos)).catch(() => {});
    },
    [desbloqueados],
  );

  const estaDesbloqueado = useCallback((id: string) => desbloqueados.includes(id), [desbloqueados]);

  return (
    <DesbloqueoContext.Provider value={{ desbloqueados, cargando, estaDesbloqueado, desbloquear }}>
      {children}
    </DesbloqueoContext.Provider>
  );
}

export function useDesbloqueo() {
  const contexto = useContext(DesbloqueoContext);
  if (!contexto) {
    throw new Error('useDesbloqueo debe usarse dentro de DesbloqueoProvider');
  }
  return contexto;
}
