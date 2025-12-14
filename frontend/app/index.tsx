// import { useEffect, useState } from 'react';
// import { View, Text, ScrollView, Pressable, StyleSheet, ImageBackground, useWindowDimensions, Modal, TextInput } from 'react-native';
// import { useRouter } from 'expo-router';
// import axios from 'axios';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import ProductCard from './productCard'; // sigurohu që ky path është i saktë

// interface Product {
//   id: number;
//   name: string;
//   description: string;
//   image: string;
//   price: number;
//   quantity?: number;
// }

// export default function Home() {
//   const router = useRouter();
//   const { width } = useWindowDimensions();
//   const [role, setRole] = useState<string | null>(null);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   const [cart, setCart] = useState<Product[]>([]);
//   const [favorites, setFavorites] = useState<Product[]>([]);
//   const [orders, setOrders] = useState<Product[]>([]);

//   const [ordersModalVisible, setOrdersModalVisible] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalMessage, setModalMessage] = useState('');
//   const requireLogin = () => {
//   if (!role) {
//     setModalMessage('Please login to continue');
//     setModalVisible(true);

//     setTimeout(() => {
//       setModalVisible(false);
//       router.push('/login');
//     }, 1200);

//     return false;
//   }
//   return true;
// };


//   useEffect(() => {
//     AsyncStorage.getItem('role').then(r => setRole(r));

//     axios.get('http://localhost:5000/api/products')
//       .then(res => {
//         const data = res.data.products || res.data;
//         setProducts(data);
//         setFilteredProducts(data);
//       })
//       .catch(err => console.log(err));
//   }, []);

//   // Filter products based on search query
//   useEffect(() => {
//     if (!searchQuery) {
//       setFilteredProducts(products);
//     } else {
//       const filtered = products.filter(p =>
//         p.name.toLowerCase().includes(searchQuery.toLowerCase())
//       );
//       setFilteredProducts(filtered);
//     }
//   }, [searchQuery, products]);

//   const handleLogout = async () => {
//     await AsyncStorage.clear();
//     setRole(null);
//     router.push('/');
//   };
// const addToCart = (product: Product) => {
//   if (!requireLogin()) return;

//   const existing = cart.find(p => p.id === product.id);
//   if (existing) {
//     existing.quantity = (existing.quantity || 1) + 1;
//     setCart([...cart]);
//   } else {
//     setCart([...cart, { ...product, quantity: 1 }]);
//   }

//   setModalMessage(`${product.name} added to cart!`);
//   setModalVisible(true);
// };
// const addToFavorites = (product: Product) => {
//   if (!requireLogin()) return;

//   if (favorites.find(p => p.id === product.id)) {
//     setModalMessage(`${product.name} is already in favorites!`);
//   } else {
//     setFavorites([...favorites, product]);
//     setModalMessage(`${product.name} added to favorites!`);
//   }
//   setModalVisible(true);
// };
// const addToOrder = (product: Product) => {
//   if (!requireLogin()) return;

//   setOrders(prev => [...prev, { ...product }]);
//   removeFromCart(product.id);

//   setModalMessage(`${product.name} added to order!`);
//   setModalVisible(true);
// };

//   const heroHeight = width > 800 ? 500 : 420;

//   function changeQuantity(id: number, arg1: number): void {
//     throw new Error('Function not implemented.');
//   }

//   return (
//     <>
//       {/* HEADER */}
//       <View style={styles.topBar}>
//         <Pressable onPress={() => setSidebarOpen(true)}>
//           <Text style={styles.menuIcon}>☰</Text>
//         </Pressable>
//         <Text style={styles.title}>FashionStore</Text>
// <View style={{ width: 300, marginHorizontal: 10 }}> 
//   <TextInput
//     placeholder="Search..."
//     value={searchQuery}
//     onChangeText={setSearchQuery}
//     placeholderTextColor="#ccc" // placeholder gri e lehtë
//     style={styles.searchInput}
//   />
// </View>

//         <View style={styles.headerRight}>
//           {role && (
//             <>
//               <Pressable onPress={() => setSidebarOpen(true)} style={{ marginRight: 10 }}>
//                 <Text style={{ color: '#fff', fontWeight: '700' }}>♥ ({favorites.length})</Text>
//               </Pressable>
//               <Pressable onPress={() => setSidebarOpen(true)} style={{ marginRight: 10 }}>
//                 <Text style={{ color: '#fff', fontWeight: '700' }}>🛒 ({cart.length})</Text>
//               </Pressable>
//               <Pressable onPress={() => setOrdersModalVisible(true)} style={{ marginRight: 10 }}>
//                 <Text style={{ color: '#fff', fontWeight: '700' }}>📦 ({orders.length})</Text>
//               </Pressable>
//             </>
//           )}

//           {role ? (
//             <Pressable style={styles.logoutBtn} onPress={handleLogout}>
//               <Text style={styles.btnText}>Logout</Text>
//             </Pressable>
//           ) : (
//             <>
//               <Pressable style={styles.loginBtn} onPress={() => router.push('/login')}>
//                 <Text style={styles.btnText}>Login</Text>
//               </Pressable>
//               <Pressable style={styles.registerBtn} onPress={() => router.push('/register')}>
//                 <Text style={styles.btnText}>Register</Text>
//               </Pressable>
//             </>
//           )}
//         </View>
//       </View>

//       <ScrollView style={styles.container}>
//         {/* HERO */}
//         <ImageBackground
//           source={require('../assets/fashion-trends-GettyImages-1457816153-d2982e954afe4b42bf5587f087da90d4.jpg')}
//           style={{ width: '100%', height: heroHeight, justifyContent: 'center' }}
//           resizeMode="cover"
//         >
//           <View style={styles.heroOverlay}>
//             <Text style={[styles.heroTitle, { fontSize: width > 800 ? 48 : 36 }]}>Welcome to FashionStore</Text>
//             <Text style={[styles.heroSubtitle, { fontSize: width > 800 ? 24 : 18 }]}>Discover the newest fashion trends!</Text>
//           </View>
//         </ImageBackground>

//         {/* FEATURED PRODUCTS */}
//         <View style={styles.section}>
//           <Text style={[styles.sectionTitle, { fontSize: width > 800 ? 32 : 24 }]}>Featured Products</Text>
//           <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//             {filteredProducts.map(product => (
//               <ProductCard
//                 key={product.id}
//                 product={product}
//                 addToCart={addToCart}
//                 addToFavorites={addToFavorites}
//               />
//             ))}
//           </ScrollView>
//         </View>
//       </ScrollView>

//       {/* SIDEBAR */}
//       {sidebarOpen && (
//         <View style={styles.overlay}>
//           <View style={styles.sidebar}>
//             <Text style={styles.logo}>FashionStore</Text>

//             {/* Favorites */}
//             <Text style={styles.sidebarTitle}>Favorites ({favorites.length})</Text>
//             {favorites.length === 0 ? <Text>No favorites yet.</Text> :
//               favorites.map(p => (
//                 <View key={p.id} style={styles.cartItem}>
//                   <Text style={{ flex: 1 }}>{p.name}</Text>
//                   <Pressable onPress={() => removeFromCart(p.id)} style={styles.removeBtn}>
//                     <Text>Remove</Text>
//                   </Pressable>
//                 </View>
//               ))
//             }

//             {/* Cart */}
//             <Text style={styles.sidebarTitle}>Cart ({cart.length})</Text>
//             {cart.length === 0 ? <Text>Cart is empty.</Text> :
//               cart.map(p => (
//                 <View key={p.id} style={styles.cartItem}>
//                   <Text style={{ flex: 1 }}>{p.name}</Text>
//                   <View style={styles.quantityControls}>
//                     <Pressable onPress={() => changeQuantity(p.id, -1)} style={styles.qtyBtn}><Text>-</Text></Pressable>
//                     <Text style={styles.qtyText}>{p.quantity}</Text>
//                     <Pressable onPress={() => changeQuantity(p.id, 1)} style={styles.qtyBtn}><Text>+</Text></Pressable>
//                   </View>
//                   <Pressable onPress={() => removeFromCart(p.id)} style={styles.removeBtn}><Text>Remove</Text></Pressable>
//                   <Pressable onPress={() => addToOrder(p)} style={styles.orderBtn}><Text>Add to Order</Text></Pressable>
//                 </View>
//               ))
//             }

//             <Pressable style={styles.closeBtn} onPress={() => setSidebarOpen(false)}>
//               <Text style={styles.closeText}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       )}

//       {/* MODAL FEEDBACK */}
//       <Modal visible={modalVisible} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalText}>{modalMessage}</Text>
//             <Pressable style={styles.modalBtn} onPress={() => setModalVisible(false)}>
//               <Text style={styles.cardBtnText}>OK</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>

//       {/* ORDERS MODAL */}
//       <Modal visible={ordersModalVisible} transparent animationType="fade">
//         <View style={styles.modalOverlay}>
//           <View style={[styles.modalContent, { width: '80%' }]}>
//             <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 10 }}>My Orders ({orders.length})</Text>
//             <ScrollView style={{ maxHeight: 300 }}>
//               {orders.length === 0 ? (
//                 <Text>No orders yet.</Text>
//               ) : (
//                 orders.map(p => (
//                   <View key={p.id} style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 8, borderColor: '#ccc' }}>
//                     <Text style={{ fontWeight: '600' }}>{p.name}</Text>
//                     {p.quantity && <Text>Quantity: {p.quantity}</Text>}
//                     <Text>Price: ${p.price}</Text>
//                     <Pressable 
//                       onPress={() => setOrders(prev => prev.filter(o => o.id !== p.id))} 
//                       style={{ marginTop: 5, backgroundColor:'#ff4d6d', padding:5, borderRadius:5 }}
//                     >
//                       <Text style={{ color:'#fff', textAlign:'center' }}>Remove</Text>
//                     </Pressable>
//                   </View>
//                 ))
//               )}
//             </ScrollView>
//             <Pressable style={[styles.modalBtn, { marginTop: 10 }]} onPress={() => setOrdersModalVisible(false)}>
//               <Text style={styles.cardBtnText}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// }

// // STYLE
// const styles = StyleSheet.create({
//   topBar: { 
//     height: 60, 
//     backgroundColor: '#000', 
//     flexDirection:'row', 
//     alignItems:'center', 
//     justifyContent:'space-between', 
//     paddingHorizontal:15 
//   },
//   menuIcon: { color:'#fff', fontSize:28 },
//   title: { color:'#fff', fontSize:20, fontWeight:'700' },
//   headerRight: { flexDirection:'row', alignItems:'center' },


// searchInput: { 
//   backgroundColor:'#555',   // hiri i errët
//   borderRadius:12,          // rrumbullakim i butë
//   paddingHorizontal:10,
//   height:35,
//   fontSize:14,
//   color:'#fff'              // tekst i bardhë brenda input
// },

//   container: { flex: 1, backgroundColor: '#fff' },
//   heroOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
//   heroTitle: { fontWeight: '700', color: '#fff', textAlign: 'center', marginBottom: 10 },
//   heroSubtitle: { color: '#fff', marginBottom: 20, textAlign: 'center' },

//   loginBtn: { backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginRight: 8 },
//   registerBtn: { backgroundColor: '#ff4d6d', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20, marginRight: 8 },
//   logoutBtn: { backgroundColor: '#000', paddingVertical: 8, paddingHorizontal: 15, borderRadius: 20 },
//   btnText: { textAlign: 'center', color: '#fff', fontSize: 14, fontWeight: '600' },

//   section: { paddingHorizontal: 20, marginTop: 30, marginBottom: 30 },
//   sectionTitle: { fontWeight: '700', marginBottom: 8, color: '#111' },

//   overlay: { position:'absolute', width:'100%', height:'100%', backgroundColor:'rgba(0,0,0,0.3)' },
//   sidebar: { width:'70%', height:'100%', backgroundColor:'#fff', padding:25 },
//   logo: { fontSize:22, fontWeight:'700', marginBottom:15 },
//   sidebarTitle: { fontSize:18, fontWeight:'700', marginTop:10, marginBottom:5 },

//   cartItem: { flexDirection:'row', alignItems:'center', marginBottom:10 },
//   quantityControls: { flexDirection:'row', alignItems:'center', marginHorizontal:5 },
//   qtyBtn: { padding:5, backgroundColor:'#ccc', borderRadius:5 },
//   qtyText: { marginHorizontal:5 },
//   removeBtn: { padding:5, backgroundColor:'#ff4d6d', borderRadius:5, marginLeft:5 },
//   orderBtn: { padding:5, backgroundColor:'#1e90ff', borderRadius:5, marginLeft:5 },

//   closeBtn: { marginTop:20, padding:12, backgroundColor:'#000', borderRadius:10 },
//   closeText: { color:'#fff', textAlign:'center', fontWeight:'700' },

//   modalOverlay: { flex:1, justifyContent:'center', alignItems:'center', backgroundColor:'rgba(0,0,0,0.5)' },
//   modalContent: { width:250, backgroundColor:'#fff', padding:20, borderRadius:12, alignItems:'center' },
//   modalText: { fontSize:16, fontWeight:'600', marginBottom:15, textAlign:'center' },
//   modalBtn: { backgroundColor:'#1e90ff', paddingVertical:10, paddingHorizontal:25, borderRadius:12 },
//   cardBtnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
// });
// function removeFromCart(id: number) {
//   throw new Error('Function not implemented.');
// }

import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ImageBackground, useWindowDimensions, Modal, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ProductCard from './productCard';

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
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Product[]>([]);

  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');

  const API_URL = 'http://localhost:5000/api';

  // 🔹 CHECK LOGIN (SYNC VERSION)
  const requireLogin = () => {
    const token = AsyncStorage.getItem('token'); // nuk e presim, vetëm për modal
    if (!token) {
      setModalMessage('Please login to continue');
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        router.push('/login');
      }, 1200);
      return false;
    }
    return true;
  };

  // 🔹 FETCH PRODUCTS
  useEffect(() => {
    AsyncStorage.getItem('role').then(r => setRole(r));
    axios.get(`${API_URL}/products`)
      .then(res => {
        const data = res.data.products || res.data;
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch(err => console.log(err));
  }, []);

  // 🔹 SEARCH
  useEffect(() => {
    if (!searchQuery) setFilteredProducts(products);
    else setFilteredProducts(products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())));
  }, [searchQuery, products]);

  // 🔹 CART / FAVORITES / ORDERS FUNCTIONS
  const addToCart = (product: Product) => {
    if (!requireLogin()) return;
    setCart(prev => {
      const exist = prev.find(p => p.id === product.id);
      if (exist) {
        return prev.map(p => p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p);
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    setModalMessage(`${product.name} added to cart!`);
    setModalVisible(true);
  };

  const removeFromCart = (id: number) => setCart(prev => prev.filter(p => p.id !== id));

  const changeQuantity = (id: number, delta: number) =>
    setCart(prev => prev.map(p => p.id === id ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) } : p));

  const addToFavorites = (product: Product) => {
    if (!requireLogin()) return;
    setFavorites(prev => {
      if (prev.find(p => p.id === product.id)) {
        setModalMessage(`${product.name} is already in favorites!`);
        setModalVisible(true);
        return prev;
      }
      setModalMessage(`${product.name} added to favorites!`);
      setModalVisible(true);
      return [...prev, product];
    });
  };

  const addToOrder = (product: Product) => {
    if (!requireLogin()) return;
    setOrders(prev => [...prev, product]);
    removeFromCart(product.id);
    setModalMessage(`${product.name} added to order!`);
    setModalVisible(true);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
    setCart([]);
    setOrders([]);
    setFavorites([]);
    router.push('/');
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
        <View style={{ width: 300, marginHorizontal: 10 }}>
          <TextInput
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#ccc"
            style={styles.searchInput}
          />
        </View>
        <View style={styles.headerRight}>
          {role && (
            <>
              <Pressable onPress={() => setSidebarOpen(true)} style={{ marginRight: 10 }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>♥ ({favorites.length})</Text>
              </Pressable>
              <Pressable onPress={() => setSidebarOpen(true)} style={{ marginRight: 10 }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>🛒 ({cart.length})</Text>
              </Pressable>
              <Pressable onPress={() => setOrdersModalVisible(true)} style={{ marginRight: 10 }}>
                <Text style={{ color: '#fff', fontWeight: '700' }}>📦 ({orders.length})</Text>
              </Pressable>
            </>
          )}
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
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                addToFavorites={addToFavorites}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <View style={styles.overlay}>
          <View style={styles.sidebar}>
            <Text style={styles.logo}>FashionStore</Text>
            <Text style={styles.sidebarTitle}>Favorites ({favorites.length})</Text>
            {favorites.length === 0 ? <Text>No favorites yet.</Text> :
              favorites.map(p => (
                <View key={p.id} style={styles.cartItem}>
                  <Text style={{ flex: 1 }}>{p.name}</Text>
                </View>
              ))}
            <Text style={styles.sidebarTitle}>Cart ({cart.length})</Text>
            {cart.length === 0 ? <Text>Cart is empty.</Text> :
              cart.map(p => (
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
              ))
            }
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

      {/* ORDERS MODAL */}
      <Modal visible={ordersModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: '80%' }]}>
            <Text style={{ fontWeight: '700', fontSize: 18, marginBottom: 10 }}>My Orders ({orders.length})</Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {orders.length === 0 ? <Text>No orders yet.</Text> :
                orders.map(p => (
                  <View key={p.id} style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 8, borderColor: '#ccc' }}>
                    <Text style={{ fontWeight: '600' }}>{p.name}</Text>
                    {p.quantity && <Text>Quantity: {p.quantity}</Text>}
                    <Text>Price: ${p.price}</Text>
                  </View>
                ))}
            </ScrollView>
            <Pressable style={[styles.modalBtn, { marginTop: 10 }]} onPress={() => setOrdersModalVisible(false)}>
              <Text style={styles.cardBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}
const styles = StyleSheet.create({
  topBar: { height: 60, backgroundColor: '#000', flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:15 },
  menuIcon: { color:'#fff', fontSize:28 },
  title: { color:'#fff', fontSize:20, fontWeight:'700' },
  headerRight: { flexDirection:'row', alignItems:'center' },
  searchInput: { backgroundColor:'#555', borderRadius:12, paddingHorizontal:10, height:35, fontSize:14, color:'#fff' },
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
  modalText: { fontSize:16, marginBottom:15, textAlign:'center', color:'#111' },
  modalBtn: { backgroundColor:'#000', paddingVertical:10, paddingHorizontal:20, borderRadius:8 },
  cardBtnText: { color:'#fff', textAlign: 'center', fontWeight:'600' },
});
