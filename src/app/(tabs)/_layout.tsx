
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

import { Colores } from '../../constants/colores';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: Colores.primario,
                tabBarInactiveTintColor: Colores.textoSuave,
                headerStyle: {
                    backgroundColor: Colores.primario,
                },
                headerTintColor: '#FFFFFF',
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Inicio',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="home"
                            size={size}
                            color={String(color ?? Colores.primario)}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="mapa"
                options={{
                    title: 'Mapa',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="map"
                            size={size}
                            color={String(color ?? Colores.primario)}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="comercios"
                options={{
                    title: 'Comercios',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="storefront"
                            size={size}
                            color={String(color ?? Colores.primario)}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="descargas"
                options={{
                    title: 'Descargas',
                    tabBarIcon: ({ color, size }) => (
                        <Ionicons
                            name="download"
                            size={size}
                            color={String(color ?? Colores.primario)}
                        />
                    ),
                }}
            />

            <Tabs.Screen
                name="favoritos"
                options={{ href: null }}
            />
        </Tabs>
    );
}
