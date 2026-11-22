
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { Directory, File, Paths } from 'expo-file-system';

import { lugaresDeRuta } from '../data';
import { Lugar } from '../types/lugar';
import { Ruta } from '../types/ruta';

const CLAVE_DESCARGAS = 'descargas';
const CLAVE_DESBLOQUEADOS = 'desbloqueados';
const DIRECTORIO_DESCARGAS = 'turismoapp-descargas';

// Información de cada lugar preparada para consultarse sin Internet.
export type LugarDescargado = Lugar & {
  imagenOriginal: string;
  galeriaOriginal: string[];
};

// Información completa de una ruta descargada.
export type ContenidoRutaDescargada = {
  ruta: Ruta;
  lugares: LugarDescargado[];
  descargadaEn: string;
};

function obtenerDirectorioBase(): Directory {
  return new Directory(Paths.document, DIRECTORIO_DESCARGAS);
}

function obtenerDirectorioRuta(rutaId: number): Directory {
  return new Directory(obtenerDirectorioBase(), `ruta-${rutaId}`);
}

function obtenerArchivoDatos(rutaId: number): File {
  return new File(obtenerDirectorioRuta(rutaId), 'datos.json');
}

// Obtener una extensión válida para cada fotografía.
function obtenerExtension(url: string): string {
  const urlSinParametros = url.split(/[?#]/)[0] ?? '';
  const coincidencia = urlSinParametros.match(/\.([a-zA-Z0-9]+)$/);
  const extension = coincidencia?.[1]?.toLowerCase();

  const extensionesPermitidas = [
    'jpg',
    'jpeg',
    'png',
    'webp',
    'gif',
    'avif',
  ];

  return extension && extensionesPermitidas.includes(extension)
    ? extension
    : 'jpg';
}

// Comprobar que el usuario tenga desbloqueada una ruta premium.
async function validarDesbloqueo(ruta: Ruta): Promise<void> {
  if (!ruta.premium) return;

  const valor = await AsyncStorage.getItem(CLAVE_DESBLOQUEADOS);

  let desbloqueados: unknown = [];

  try {
    if (valor) {
      desbloqueados = JSON.parse(valor);
    }
  } catch {
    desbloqueados = [];
  }

  const identificador = `ruta-${ruta.id}`;

  if (
    !Array.isArray(desbloqueados) ||
    !desbloqueados.includes(identificador)
  ) {
    throw new Error(
      'Esta ruta premium debe desbloquearse antes de descargarla.'
    );
  }
}

// Descargar una fotografía y comprobar que se haya guardado.
async function descargarImagen(
  url: string,
  destino: File,
): Promise<void> {
  if (!url || !/^https?:\/\//i.test(url)) {
    throw new Error('La dirección de una fotografía no es válida.');
  }

  const archivo = await File.downloadFileAsync(url, destino);

  if (!archivo.exists) {
    throw new Error('No se pudo guardar una fotografía de la ruta.');
  }
}

/**
 * Obtener los identificadores de las rutas descargadas.
 * También comprueba que sus archivos locales existan.
 */
export async function listarDescargas(): Promise<number[]> {
  let valor: string | null;

  try {
    valor = await AsyncStorage.getItem(CLAVE_DESCARGAS);
  } catch {
    return [];
  }

  if (!valor) return [];

  let datos: unknown;

  try {
    datos = JSON.parse(valor);
  } catch {
    return [];
  }

  if (!Array.isArray(datos)) return [];

  const ids = Array.from(
    new Set(
      datos.filter(
        (id): id is number =>
          typeof id === 'number' &&
          Number.isInteger(id) &&
          id > 0
      )
    )
  );

  const idsValidos = ids.filter((id) => {
    const directorio = obtenerDirectorioRuta(id);
    const archivo = obtenerArchivoDatos(id);

    return directorio.exists && archivo.exists;
  });

  if (idsValidos.length !== ids.length) {
    try {
      await AsyncStorage.setItem(
        CLAVE_DESCARGAS,
        JSON.stringify(idsValidos)
      );
    } catch {
      // Se conservan los resultados válidos en memoria.
    }
  }

  return idsValidos;
}

/**
 * Comprobar si una ruta está descargada.
 */
export async function estaDescargada(
  rutaId: number
): Promise<boolean> {
  if (!Number.isInteger(rutaId) || rutaId <= 0) return false;

  const ids = await listarDescargas();

  return ids.includes(rutaId);
}

/**
 * Descargar fichas, fotografías y coordenadas de una ruta.
 */
export async function descargarRuta(ruta: Ruta): Promise<void> {

  // Verificar primero el desbloqueo premium.
  await validarDesbloqueo(ruta);

  // Evitar descargar nuevamente una ruta ya guardada.
  if (await estaDescargada(ruta.id)) return;

  // Comprobar conexión a Internet.
  const conexion = await NetInfo.fetch();

  if (
    conexion.isConnected === false ||
    conexion.isInternetReachable === false
  ) {
    throw new Error(
      'Necesitas conexión a Internet para descargar esta ruta.'
    );
  }

  // Obtener los lugares siguiendo el orden de las paradas.
  const lugaresRuta = lugaresDeRuta(ruta);

  if (
    ruta.paradas.length === 0 ||
    lugaresRuta.length !== ruta.paradas.length
  ) {
    throw new Error(
      'No se encontraron todos los lugares de esta ruta.'
    );
  }

  const directorioBase = obtenerDirectorioBase();

  directorioBase.create({
    idempotent: true,
    intermediates: true,
  });

  // Directorio temporal para evitar registrar descargas incompletas.
  const directorioTemporal = new Directory(
    directorioBase,
    `ruta-${ruta.id}-temporal`
  );

  if (directorioTemporal.exists) {
    directorioTemporal.delete();
  }

  directorioTemporal.create({
    intermediates: true,
  });

  const imagenesTemporales = new Directory(
    directorioTemporal,
    'imagenes'
  );

  imagenesTemporales.create({
    intermediates: true,
  });

  const directorioFinal = obtenerDirectorioRuta(ruta.id);

  const imagenesFinales = new Directory(
    directorioFinal,
    'imagenes'
  );

  let directorioMovido = false;

  try {
    const lugaresGuardados: LugarDescargado[] = [];

    // Descargar cada lugar perteneciente a la ruta.
    for (const lugar of lugaresRuta) {

      // Fotografía principal.
      const nombreImagen =
        `lugar-${lugar.id}-principal.${obtenerExtension(lugar.imagen)}`;

      await descargarImagen(
        lugar.imagen,
        new File(imagenesTemporales, nombreImagen)
      );

      const imagenLocal = new File(
        imagenesFinales,
        nombreImagen
      ).uri;

      // Fotografías adicionales de la galería.
      const galeriaOriginal = lugar.galeria ?? [];
      const galeriaLocal: string[] = [];

      for (let i = 0; i < galeriaOriginal.length; i++) {
        const url = galeriaOriginal[i];

        const nombreGaleria =
          `lugar-${lugar.id}-galeria-${i + 1}.${obtenerExtension(url)}`;

        await descargarImagen(
          url,
          new File(imagenesTemporales, nombreGaleria)
        );

        galeriaLocal.push(
          new File(imagenesFinales, nombreGaleria).uri
        );
      }

      // Guardar la ficha utilizando las rutas locales de las imágenes.
      lugaresGuardados.push({
        ...lugar,
        imagen: imagenLocal,
        galeria: galeriaLocal,
        imagenOriginal: lugar.imagen,
        galeriaOriginal,
      });
    }

    // Crear el archivo con toda la información de la ruta.
    const contenido: ContenidoRutaDescargada = {
      ruta,
      lugares: lugaresGuardados,
      descargadaEn: new Date().toISOString(),
    };

    const archivoDatos = new File(
      directorioTemporal,
      'datos.json'
    );

    archivoDatos.create({
      intermediates: true,
      overwrite: true,
    });

    await archivoDatos.write(
      JSON.stringify(contenido, null, 2)
    );

    // Reemplazar la descarga anterior solamente cuando
    // la nueva descarga esté completamente preparada.
    if (directorioFinal.exists) {
      directorioFinal.delete();
    }

    await directorioTemporal.move(directorioFinal);

    directorioMovido = true;

    // Registrar la descarga después de guardar los archivos.
    const idsActuales = await listarDescargas();

    const nuevosIds = Array.from(
      new Set([...idsActuales, ruta.id])
    );

    await AsyncStorage.setItem(
      CLAVE_DESCARGAS,
      JSON.stringify(nuevosIds)
    );

  } catch (error) {

    // Eliminar archivos incompletos si ocurre un error.
    try {
      if (directorioTemporal.exists) {
        directorioTemporal.delete();
      }

      if (directorioMovido && directorioFinal.exists) {
        directorioFinal.delete();
      }
    } catch {
      // Se conserva el error original.
    }

    throw error;
  }
}

/**
 * Leer la información almacenada de una ruta sin Internet.
 * Función auxiliar para las pantallas que necesitan mostrar
 * el contenido descargado.
 */
export async function obtenerContenidoDescargado(
  rutaId: number
): Promise<ContenidoRutaDescargada | null> {

  if (!(await estaDescargada(rutaId))) {
    return null;
  }

  const archivo = obtenerArchivoDatos(rutaId);

  try {
    const contenido = await archivo.text();

    return JSON.parse(contenido) as ContenidoRutaDescargada;
  } catch {
    return null;
  }
}

/**
 * Eliminar una ruta y todas sus fotografías descargadas.
 */
export async function eliminarDescarga(
  rutaId: number
): Promise<void> {

  const ids = await listarDescargas();

  const directorio = obtenerDirectorioRuta(rutaId);

  if (directorio.exists) {
    directorio.delete();
  }

  const directorioTemporal = new Directory(
    obtenerDirectorioBase(),
    `ruta-${rutaId}-temporal`
  );

  if (directorioTemporal.exists) {
    directorioTemporal.delete();
  }

  const nuevosIds = ids.filter((id) => id !== rutaId);

  await AsyncStorage.setItem(
    CLAVE_DESCARGAS,
    JSON.stringify(nuevosIds)
  );
}
