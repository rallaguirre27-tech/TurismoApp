
import { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Alert,
    ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';

import { Colores } from '../constants/colores';
import { obtenerContenidoPremium } from '../data';
import { useDesbloqueo } from '../context/DesbloqueoContext';

export default function PagoScreen() {
    const { contenido } = useLocalSearchParams<{ contenido?: string }>();

    const encontrado = contenido
        ? obtenerContenidoPremium(contenido)
        : undefined;

    const { desbloquear, estaDesbloqueado, cargando } = useDesbloqueo();

    const [metodo, setMetodo] = useState('Yape');
    const [procesando, setProcesando] = useState(false);

    const yaDesbloqueado = encontrado
        ? estaDesbloqueado(encontrado.id)
        : false;

    async function confirmarPago() {
        if (!encontrado || cargando || procesando || yaDesbloqueado) return;

        try {
            setProcesando(true);

            await desbloquear(encontrado.id);

            Alert.alert(
                '¡Desbloqueo exitoso!',
                `Ya tienes acceso a ${encontrado.titulo}.`,
                [
                    {
                        text: 'Continuar',
                        onPress: () => router.back(),
                    },
                ],
            );
        } catch (error) {
            Alert.alert(
                'Error',
                'No se pudo guardar el desbloqueo. Inténtalo nuevamente.',
            );
        } finally {
            setProcesando(false);
        }
    }

    if (!encontrado) {
        return (
            <View style={styles.contenedor}>
                <Text style={styles.titulo}>Contenido no encontrado</Text>
                <Pressable style={styles.boton} onPress={() => router.back()}>
                    <Text style={styles.textoBoton}>Volver</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <View style={styles.contenedor}>
            <Text style={styles.titulo}>Desbloquea contenido Premium</Text>

            <View style={styles.tarjeta}>
                <Text style={styles.nombre}>{encontrado.titulo}</Text>
                <Text style={styles.descripcion}>
                    {encontrado.descripcion}
                </Text>
                <Text style={styles.precio}>
                    S/ {encontrado.precio.toFixed(2)}
                </Text>
            </View>

            <Text style={styles.subtitulo}>Selecciona tu método de pago</Text>

            {['Yape', 'Plin', 'Tarjeta'].map((opcion) => (
                <Pressable
                    key={opcion}
                    style={[
                        styles.opcion,
                        metodo === opcion && styles.opcionSeleccionada,
                    ]}
                    onPress={() => setMetodo(opcion)}
                >
                    <Text style={styles.textoOpcion}>
                        {metodo === opcion ? '🔘' : '⚪'} {opcion}
                    </Text>
                </Pressable>
            ))}

            <Text style={styles.aviso}>
                Esta es una demostración académica. No se realizará ningún cobro real.
            </Text>

            {yaDesbloqueado ? (
                <Text style={styles.exito}>Este contenido ya está desbloqueado.</Text>
            ) : (
                <Pressable
                    style={[
                        styles.boton,
                        (procesando || cargando) && styles.botonDesactivado,
                    ]}
                    onPress={confirmarPago}
                    disabled={procesando || cargando}
                >
                    {procesando ? (
                        <ActivityIndicator color="#FFFFFF" />
                    ) : (
                        <Text style={styles.textoBoton}>
                            Confirmar pago simulado
                        </Text>
                    )}
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        flex: 1,
        backgroundColor: Colores.fondo,
        padding: 20,
    },
    titulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: Colores.primario,
        marginBottom: 20,
    },
    tarjeta: {
        backgroundColor: Colores.tarjeta,
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colores.borde,
        marginBottom: 24,
    },
    nombre: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colores.texto,
    },
    descripcion: {
        color: Colores.textoSuave,
        marginTop: 8,
    },
    precio: {
        fontSize: 25,
        fontWeight: 'bold',
        color: Colores.primario,
        marginTop: 15,
    },
    subtitulo: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colores.texto,
        marginBottom: 12,
    },
    opcion: {
        backgroundColor: Colores.tarjeta,
        padding: 15,
        borderRadius: 9,
        borderWidth: 1,
        borderColor: Colores.borde,
        marginBottom: 10,
    },
    opcionSeleccionada: {
        borderColor: Colores.primario,
        borderWidth: 2,
    },
    textoOpcion: {
        fontSize: 16,
        color: Colores.texto,
    },
    aviso: {
        fontSize: 12,
        color: Colores.textoSuave,
        marginVertical: 18,
    },
    boton: {
        backgroundColor: Colores.primario,
        padding: 16,
        borderRadius: 10,
        alignItems: 'center',
    },
    botonDesactivado: {
        opacity: 0.5,
    },
    textoBoton: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 15,
    },
    exito: {
        color: '#287A45',
        fontWeight: 'bold',
        marginTop: 12,
    },
});
