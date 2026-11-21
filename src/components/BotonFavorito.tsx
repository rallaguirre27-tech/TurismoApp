
import { Pressable, StyleSheet, Text } from 'react-native';
import { useFavoritos } from '../contexto/FavoritosContext';

type Props = {
  id: number;
  size?: number;
};

export default function BotonFavorito({ id, size = 26 }: Props) {
  const { esFavorito, alternarFavorito, cargando } = useFavoritos();

  const activo = esFavorito(id);

  return (
    <Pressable
      onPress={() => alternarFavorito(id)}
      disabled={cargando}
      style={styles.boton}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={
        activo ? 'Quitar de favoritos' : 'Agregar a favoritos'
      }
      accessibilityState={{ selected: activo, disabled: cargando }}
    >
      <Text
        style={[
          styles.corazon,
          {
            fontSize: size,
            color: activo ? '#E53935' : '#777777',
          },
        ]}
      >
        {activo ? '♥' : '♡'}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  boton: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  corazon: {
    fontWeight: 'bold',
  },
});
