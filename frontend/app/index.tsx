import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ImageBackground, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
}

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [role, setRole] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Marrim role nga storage
    AsyncStorage.getItem('role').then(r => setRole(r));

    // Marrim produktet
    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data.products || res.data)) // mund të ndryshojë në backend
      .catch(err => console.log(err));
  }, []);

  // Funksioni Logout
  const handleLogout = async () => {
    await AsyncStorage.removeItem('role');
    await AsyncStorage.removeItem('accessToken'); // nese ruhet token
    setRole(null);
    router.push('/'); // ridrejto ne homepage
  };

  const heroHeight = width > 800 ? 500 : 420;

  return (
    <ScrollView style={styles.container}>
      {/* HERO SECTION */}
      <ImageBackground
        source={require('../assets/fashion-trends-GettyImages-1457816153-d2982e954afe4b42bf5587f087da90d4.jpg')}
        style={{ width: '100%', height: heroHeight, justifyContent: 'center' }}
        resizeMode="cover"
      >
        <View style={styles.heroOverlay}>
          <Text style={[styles.heroTitle, { fontSize: width > 800 ? 48 : 36 }]}>Welcome to FashionStore</Text>
          <Text style={[styles.heroSubtitle, { fontSize: width > 800 ? 24 : 18 }]}>Discover the newest fashion trends!</Text>

          {/* Buttons */}
          <View style={styles.heroButtons}>
            {role ? (
              // Logout button kur është loguar
              <Pressable style={styles.logoutBtn} onPress={handleLogout}>
                <Text style={styles.btnText}>Logout</Text>
              </Pressable>
            ) : (
              <>
                <Pressable style={styles.loginBtn} onPress={() => router.push('/login')}>
                  <Text style={styles.btnText}>Login</Text>
                </Pressable>
                <Pressable style={styles.registerBtn} onPress={() => router.push('/register')}>
                  <Text style={styles.btnText}>Register</Text>
                </Pressable>
              </>
            )}

          </View>
        </View>
      </ImageBackground>

      

      {/* FEATURED PRODUCTS */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { fontSize: width > 800 ? 32 : 24 }]}>Featured Products</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {products.map(product => (
            <View key={product.id} style={styles.card}>
              <ImageBackground source={{ uri: product.image }} style={styles.cardImage} imageStyle={{ borderRadius: 12 }}/>
              <Text style={styles.cardName}>{product.name}</Text>
              <Text style={styles.cardDesc}>{product.description}</Text>
              <Text style={styles.cardPrice}>${product.price}</Text>
            </View>
          ))}
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  heroTitle: { fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 10 },
  heroSubtitle: { color: '#fff', marginBottom: 20, textAlign: 'center' },
  heroButtons: { flexDirection: 'row', marginTop: 10 },
  loginBtn: { backgroundColor: '#000', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 25, marginRight: 10 },
  registerBtn: { backgroundColor: '#ff4d6d', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 25 },
  logoutBtn: { backgroundColor: '#000', paddingVertical: 14, paddingHorizontal: 25, borderRadius: 25 }, // Logout button
  btnText: { textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: '600' },

  adminMenu: { padding: 20, backgroundColor: '#f8f8f8', marginTop: 20, borderRadius: 15 },
  adminTitle: { fontSize: 20, fontWeight: '700', marginBottom: 10 },
  adminBtn: { padding: 12, backgroundColor: '#ff4d6d', borderRadius: 10, marginBottom: 10 },
  adminBtnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },

  section: { paddingHorizontal: 20, marginTop: 30, marginBottom: 30 },
  sectionTitle: { fontWeight: '700', marginBottom: 8, color: '#111' },
  card: { width: 200, backgroundColor: '#fff', borderRadius: 15, marginRight: 15, padding: 10 },
  cardImage: { width: '100%', height: 120, borderRadius: 12, marginBottom: 10 },
  cardName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#777', marginBottom: 6 },
  cardPrice: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 10 },
});
