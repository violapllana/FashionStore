import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ImageBackground, useWindowDimensions, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  quantity?: number;
}

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [role, setRole] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Product[]>([]);

  // Modal për feedback
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  useEffect(() => {
    AsyncStorage.getItem('role').then(r => setRole(r));

    axios.get('http://localhost:5000/api/products')
      .then(res => setProducts(res.data.products || res.data))
      .catch(err => console.log(err));
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
    router.push('/');
  };

  // --- CART FUNCTIONS ---
  const addToCart = (product: Product) => {
    const existing = cart.find(p => p.id === product.id);
    if (existing) {
      existing.quantity = (existing.quantity || 1) + 1;
      setCart([...cart]);
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    setModalMessage(`${product.name} added to cart!`);
    setModalVisible(true);
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter(p => p.id !== id));
  };

  const changeQuantity = (id: number, delta: number) => {
    setCart(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) }
          : p
      )
    );
  };

  const addToOrder = (product: Product) => {
    setOrders(prev => [...prev, { ...product }]);
    removeFromCart(product.id);
    setModalMessage(`${product.name} added to order!`);
    setModalVisible(true);
  };

  // --- FAVORITES FUNCTIONS ---
  const addToFavorites = (product: Product) => {
    if (favorites.find(p => p.id === product.id)) {
      setModalMessage(`${product.name} is already in favorites!`);
    } else {
      setFavorites([...favorites, product]);
      setModalMessage(`${product.name} added to favorites!`);
    }
    setModalVisible(true);
  };

  const removeFromFavorites = (id: number) => {
    setFavorites(favorites.filter(p => p.id !== id));
  };

  const heroHeight = width > 800 ? 500 : 420;

  return (
    <>
      {/* HEADER */}
      <View style={styles.topBar}>
        <Pressable onPress={() => setSidebarOpen(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <Text style={styles.title}>FashionStore</Text>

        {/* LOGIN / REGISTER or LOGOUT */}
        <View style={styles.headerRight}>
          {role ? (
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

      <ScrollView style={styles.container}>
        {/* HERO */}
        <ImageBackground
          source={require('../assets/fashion-trends-GettyImages-1457816153-d2982e954afe4b42bf5587f087da90d4.jpg')}
          style={{ width: '100%', height: heroHeight, justifyContent: 'center' }}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text style={[styles.heroTitle, { fontSize: width > 800 ? 48 : 36 }]}>Welcome to FashionStore</Text>
            <Text style={[styles.heroSubtitle, { fontSize: width > 800 ? 24 : 18 }]}>Discover the newest fashion trends!</Text>
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

                <View style={styles.cardButtons}>
                  <Pressable style={styles.cartBtn} onPress={() => addToCart(product)}>
                    <Text style={styles.cardBtnText}>Add to Cart</Text>
                  </Pressable>
                  <Pressable style={styles.favBtn} onPress={() => addToFavorites(product)}>
                    <Text style={styles.cardBtnText}>♥</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <View style={styles.overlay}>
          <View style={styles.sidebar}>
            <Text style={styles.logo}>FashionStore</Text>

            {/* Cart */}
            <Text style={styles.sidebarTitle}>Cart ({cart.length})</Text>
            {cart.map(p => (
              <View key={p.id} style={styles.cartItem}>
                <Text style={{ flex: 1 }}>{p.name}</Text>
                <View style={styles.quantityControls}>
                  <Pressable onPress={() => changeQuantity(p.id, -1)} style={styles.qtyBtn}><Text>-</Text></Pressable>
                  <Text style={styles.qtyText}>{p.quantity}</Text>
                  <Pressable onPress={() => changeQuantity(p.id, 1)} style={styles.qtyBtn}><Text>+</Text></Pressable>
                </View>
                <Pressable onPress={() => removeFromCart(p.id)} style={styles.removeBtn}><Text>Remove</Text></Pressable>
                <Pressable onPress={() => addToOrder(p)} style={styles.orderBtn}><Text>Add to Order</Text></Pressable>
              </View>
            ))}

            {/* Favorites */}
            <Text style={styles.sidebarTitle}>Favorites ({favorites.length})</Text>
            {favorites.map(p => (
              <View key={p.id} style={styles.cartItem}>
                <Text style={{ flex: 1 }}>{p.name}</Text>
                <Pressable onPress={() => removeFromFavorites(p.id)} style={styles.removeBtn}><Text>Remove</Text></Pressable>
              </View>
            ))}

            <Pressable style={styles.closeBtn} onPress={() => setSidebarOpen(false)}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable style={styles.modalBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.cardBtnText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  topBar: { 
    height: 60, 
    backgroundColor: '#000', 
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    paddingHorizontal:15 
  },
  menuIcon: { color:'#fff', fontSize:28 },
  title: { color:'#fff', fontSize:20, fontWeight:'700' },
  headerRight: { flexDirection:'row', alignItems:'center' },

  container: { flex: 1, backgroundColor: '#fff' },
  heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  heroTitle: { fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 10 },
  heroSubtitle: { color: '#fff', marginBottom: 20, textAlign: 'center' },

  loginBtn: { backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginRight: 8 },
  registerBtn: { backgroundColor: '#ff4d6d', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginRight: 8 },
  logoutBtn: { backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
  btnText: { textAlign: 'center', color: '#fff', fontSize: 14, fontWeight: '600' },

  section: { paddingHorizontal: 20, marginTop: 30, marginBottom: 30 },
  sectionTitle: { fontWeight: '700', marginBottom: 8, color: '#111' },
  card: { width: 200, backgroundColor: '#fff', borderRadius: 15, marginRight: 15, padding: 10 },
  cardImage: { width: '100%', height: 120, borderRadius: 12, marginBottom: 10 },
  cardName: { fontSize: 18, fontWeight: '600', marginBottom: 4 },
  cardDesc: { fontSize: 14, color: '#777', marginBottom: 6 },
  cardPrice: { fontSize: 16, fontWeight: '700', color: '#111', marginBottom: 10 },

  cardButtons: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  cartBtn: { flex: 1, backgroundColor: '#1e90ff', paddingVertical: 8, borderRadius: 12, marginRight: 8 },
  favBtn: { width: 50, backgroundColor: '#ff4d6d', paddingVertical: 8, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  cardBtnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },

  overlay: { position:'absolute', width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.3)' },
  sidebar: { width:'70%', height:'100%', backgroundColor:'#fff', padding:25 },
  logo: { fontSize:22, fontWeight:'700', marginBottom:15 },
  sidebarTitle: { fontSize:18, fontWeight:'700', marginTop:10, marginBottom:5 },

  cartItem: { flexDirection:'row', alignItems:'center', marginBottom:10 },
  quantityControls: { flexDirection:'row', alignItems:'center', marginHorizontal:5 },
  qtyBtn: { padding:5, backgroundColor:'#ccc', borderRadius:5 },
  qtyText: { marginHorizontal:5 },
  removeBtn: { padding:5, backgroundColor:'#ff4d6d', borderRadius:5, marginLeft:5 },
  orderBtn: { padding:5, backgroundColor:'#1e90ff', borderRadius:5, marginLeft:5 },

  closeBtn: { marginTop:20, padding:12, backgroundColor:'#000', borderRadius:10 },
  closeText: { color:'#fff', textAlign:'center', fontWeight:'700' },

  modalOverlay: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' },
  modalContent: { width:250, backgroundColor:'#fff', padding:20, borderRadius:12, alignItems:'center' },
  modalText: { fontSize:16, fontWeight:'600', marginBottom:15, textAlign:'center' },
  modalBtn: { backgroundColor:'#1e90ff', paddingVertical:10, paddingHorizontal:25, borderRadius:12 },
});
