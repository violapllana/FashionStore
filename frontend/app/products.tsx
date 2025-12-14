import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Image, StyleSheet, Pressable, useWindowDimensions, TextInput, ActivityIndicator } from 'react-native';
import axios from 'axios';

interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
}

export default function ProductsPage() {
  const { width } = useWindowDimensions();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const columns = width > 800 ? 3 : width > 500 ? 2 : 1;
  const cardWidth = width / columns - 30;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/products', {
        params: { q: search }
      });
      setProducts(res.data.products);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Our Products</Text>

      {/* Search Input */}
      <TextInput
        placeholder="Search products..."
        value={search}
        onChangeText={setSearch}
        style={styles.searchInput}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#ff4d6d" style={{ marginTop: 50 }} />
      ) : (
        <View style={[styles.grid, { flexDirection: 'row', flexWrap: 'wrap' }]}>
          {products.map((product) => (
            <View key={product.id} style={[styles.card, { width: cardWidth }]}>
              <Image source={{ uri: product.image }} style={styles.cardImage} />
              <Text style={styles.cardName}>{product.name}</Text>
              <Text style={styles.cardPrice}>{`$${product.price}`}</Text>
              <Pressable style={styles.cardButton}>
                <Text style={styles.cardButtonText}>Buy Now</Text>
              </Pressable>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20, color: '#111' },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 20,
    fontSize: 16
  },
  grid: { justifyContent: 'space-between' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardImage: { width: '100%', height: 150, borderRadius: 12, marginBottom: 10 },
  cardName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  cardPrice: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 10 },
  cardButton: { backgroundColor: '#ff4d6d', paddingVertical: 10, borderRadius: 20 },
  cardButtonText: { textAlign: 'center', color: '#fff', fontWeight: '700' },
});
