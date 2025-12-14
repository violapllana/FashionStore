import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ImageBackground, Alert } from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products');
      setProducts(res.data.products);
    } catch (err) {
      console.log(err);
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/products/${id}`);
      Alert.alert('Deleted', 'Product deleted successfully');
      fetchProducts(); // rifresko listën
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not delete product');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      <Pressable style={styles.createBtn} onPress={() => router.push('/productForm')}>
        <Text style={styles.createBtnText}>Create New Product</Text>
      </Pressable>

      {products.map((product) => (
        <View key={product.id} style={styles.card}>
          <ImageBackground source={{ uri: product.image }} style={styles.cardImage} imageStyle={{ borderRadius: 12 }}/>
          <Text style={styles.cardName}>{product.name}</Text>
          <Text style={styles.cardDesc}>{product.description}</Text>
          <Text style={styles.cardPrice}>${product.price}</Text>

          <View style={styles.cardButtons}>
            <Pressable style={styles.editBtn} onPress={() => router.push({ pathname: '/productForm', params: { id: product.id } })}>
              <Text style={styles.btnText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.deleteBtn} onPress={() => deleteProduct(product.id)}>
              <Text style={styles.btnText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  createBtn: { padding: 12, backgroundColor: '#000', borderRadius: 10, marginBottom: 20 },
  createBtnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
  card: { backgroundColor: '#f9f9f9', borderRadius: 15, marginBottom: 15, padding: 10 },
  cardImage: { width: '100%', height: 120, marginBottom: 10 },
  cardName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#555', marginBottom: 4 },
  cardPrice: { fontSize: 16, fontWeight: '700', marginBottom: 10 },
  cardButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  editBtn: { padding: 10, backgroundColor: '#ffb400', borderRadius: 10, flex: 1, marginRight: 5 },
  deleteBtn: { padding: 10, backgroundColor: '#ff4d6d', borderRadius: 10, flex: 1, marginLeft: 5 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
