import React from 'react';
import { View, Text, Pressable, ImageBackground, StyleSheet } from 'react-native';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity?: number;
}

interface Props {
  product: Product;
  addToCart: (p: Product) => void;
  addToFavorites: (p: Product) => void;
}

export default function ProductCard({ product, addToCart, addToFavorites }: Props) {
  return (
    <View style={styles.card}>
      <ImageBackground source={{ uri: product.image }} style={styles.cardImage} imageStyle={{ borderRadius: 12 }}/>
      <Text style={styles.cardName}>{product.name}</Text>
      <Text style={styles.cardDesc}>{product.description}</Text>
      <Text style={styles.cardPrice}>${product.price}</Text>

      <View style={styles.cardButtons}>
        <Pressable style={styles.cartBtn} onPress={() => addToCart(product)}>
          <Text style={styles.cardBtnText}>Add to Cart</Text>
        </Pressable>
        <Pressable style={styles.favBtn} onPress={() => addToFavorites(product)}>
          <Text style={styles.cardBtnText}>♥</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { width: 200, backgroundColor: '#fff', borderRadius: 15, marginRight: 15, padding: 10 },
  cardImage: { width: '100%', height: 120, borderRadius: 12, marginBottom: 10 },
  cardName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#777', marginBottom: 6 },
  cardPrice: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 10 },

  cardButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  cartBtn: { flex: 1, backgroundColor: '#1e90ff', paddingVertical: 8, borderRadius: 12, marginRight: 8 },
  favBtn: { width: 50, backgroundColor: '#ff4d6d', paddingVertical: 8, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardBtnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});
