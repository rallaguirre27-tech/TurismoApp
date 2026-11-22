
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { router } from 'expo-router';

import { Colores } from '../constants/colores';
import { useDesbloqueo } from '../context/DesbloqueoContext';

type Props = {
    contenidoId: string;
    precio: number;
};

export function CandadoPremium({ contenidoId, precio }: Props) {
    const { estaDesbloqueado, cargando } = useDesbloqueo();

    const desbloqueado = estaDesbloqueado(contenidoId);

    if (cargando) {
        return (
            <View style={styles.contenedor}>
                <Text style={styles.texto}>Verificando acceso...</Text>
            </View>
        );
    }

    if (desbloqueado) {
        return (
            <View style={styles.contenedorDesbloqueado}>
                <Text style={styles.textoDesbloqueado}>
                    🔓 Contenido desbloqueado
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.contenedor}>
            <Text style={styles.icono}>🔒</Text>

            <Text style={styles.titulo}>Contenido Premium</Text>

            <Text style={styles.texto}>
                Desbloquea esta experiencia para acceder a todo su contenido.
            </Text>

            <Pressable
                style={styles.boton}
                onPress={() =>
                    router.push({
                        pathname: '/pago',
                        params: { contenido: contenidoId },
                    })
                }
            >
                <Text style={styles.textoBoton}>
                    Desbloquear - S/ {precio.toFixed(2)}
                </Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    contenedor: {
        backgroundColor: Colores.tarjeta,
        padding: 18,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colores.borde,
        alignItems: 'center',
        marginVertical: 10,
    },
    contenedorDesbloqueado: {
        backgroundColor: '#E8F5E9',
        padding: 14,
        borderRadius: 10,
        marginVertical: 10,
    },
    icono: {
        fontSize: 30,
        marginBottom: 8,
    },
    titulo: {
        fontSize: 17,
        fontWeight: 'bold',
        color: Colores.primario,
        marginBottom: 8,
    },
    texto: {
        color: Colores.textoSuave,
        textAlign: 'center',
        marginBottom: 12,
    },
    textoDesbloqueado: {
        color: '#287A45',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    boton: {
        backgroundColor: Colores.primario,
        padding: 12,
        borderRadius: 8,
        width: '100%',
        alignItems: 'center',
    },
    textoBoton: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});
