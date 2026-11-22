
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

const CLAVE_DESBLOQUEADOS = 'desbloqueados';

type DesbloqueoContextoTipo = {
  desbloqueados: string[];
  cargando: boolean;
  estaDesbloqueado: (id: string) => boolean;
  desbloquear: (id: string) => Promise<void>;
};

const DesbloqueoContext = createContext<
    DesbloqueoContextoTipo | undefined
>(undefined);

export function DesbloqueoProvider({
                                     children,
                                   }: {
  children: ReactNode;
}) {
  const [desbloqueados, setDesbloqueados] = useState<string[]>([]);
  const [cargando, setCargando] = useState(true);

  // Recuperar los desbloqueos guardados
  useEffect(() => {
    async function cargarDesbloqueos() {
      try {
        const valor = await AsyncStorage.getItem(CLAVE_DESBLOQUEADOS);

        if (valor) {
          const datos: unknown = JSON.parse(valor);

          if (
              Array.isArray(datos) &&
              datos.every((id) => typeof id === 'string')
          ) {
            setDesbloqueados(datos);
          }
        }
      } catch (error) {
        console.error('Error al cargar los desbloqueos:', error);
      } finally {
        setCargando(false);
      }
    }

    cargarDesbloqueos();
  }, []);

  // Desbloquear y guardar el contenido premium
  const desbloquear = useCallback(
      async (id: string) => {
        if (cargando || !id.trim()) return;

        if (desbloqueados.includes(id)) return;

        const nuevos = [...desbloqueados, id];

        try {
          await AsyncStorage.setItem(
              CLAVE_DESBLOQUEADOS,
              JSON.stringify(nuevos),
          );

          setDesbloqueados(nuevos);
        } catch (error) {
          console.error('Error al guardar el desbloqueo:', error);
          throw error;
        }
      },
      [desbloqueados, cargando],
  );

  // Comprobar si un contenido ya está desbloqueado
  const estaDesbloqueado = useCallback(
      (id: string) => desbloqueados.includes(id),
      [desbloqueados],
  );

  return (
      <DesbloqueoContext.Provider
          value={{
            desbloqueados,
            cargando,
            estaDesbloqueado,
            desbloquear,
          }}
      >
        {children}
      </DesbloqueoContext.Provider>
  );
}

// Hook para utilizar el contexto desde otros componentes
export function useDesbloqueo() {
  const contexto = useContext(DesbloqueoContext);

  if (!contexto) {
    throw new Error(
        'useDesbloqueo debe usarse dentro de DesbloqueoProvider',
    );
  }

  return contexto;
}
