import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ImageBackground,
  useWindowDimensions,
  Modal,
  TextInput,
} from "react-native";
import { useNavigation, useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProductCard from "./productCard";
import Footer from "./footer";

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
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [role, setRole] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Product[]>([]);

  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const API_URL = "http://localhost:5000/api";

  // 🔹 CHECK LOGIN
  const requireLogin = () => {
    const token = AsyncStorage.getItem("token");
    if (!token) {
      setModalMessage("Please login to continue");
      setModalVisible(true);
      setTimeout(() => {
        setModalVisible(false);
        router.push("/login");
      }, 1200);
      return false;
    }
    return true;
  };

  // 🔹 FETCH PRODUCTS
  useEffect(() => {
    AsyncStorage.getItem("role").then((r) => setRole(r));
    axios
      .get(`${API_URL}/products`)
      .then((res) => {
        const data = res.data.products || res.data;
        setProducts(data);
        setFilteredProducts(data);
      })
      .catch((err) => console.log(err));
  }, []);
  // 🔹 FETCH USER ORDERS
  const fetchOrders = async () => {
    if (!role) return;
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data); // backend duhet të kthejë listën e order-ve
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [role]);

  // 🔹 SEARCH
  useEffect(() => {
    if (!searchQuery) setFilteredProducts(products);
    else
      setFilteredProducts(
        products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
  }, [searchQuery, products]);

  // 🔹 CART / FAVORITES / ORDERS FUNCTIONS
  const addToCart = (product: Product) => {
    if (!requireLogin()) return;
    setCart((prev) => {
      const exist = prev.find((p) => p.id === product.id);
      if (exist) {
        return prev.map((p) =>
          p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p
        );
      } else {
        return [...prev, { ...product, quantity: 1 }];
      }
    });
    setModalMessage(`${product.name} added to cart!`);
    setModalVisible(true);
  };

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((p) => p.id !== id));

  const changeQuantity = (id: number, delta: number) =>
    setCart((prev) =>
      prev.map((p) =>
        p.id === id
          ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) }
          : p
      )
    );

  const addToFavorites = (product: Product) => {
    if (!requireLogin()) return;
    setFavorites((prev) => {
      if (prev.find((p) => p.id === product.id)) {
        setModalMessage(`${product.name} is already in favorites!`);
        setModalVisible(true);
        return prev;
      }
      setModalMessage(`${product.name} added to favorites!`);
      setModalVisible(true);
      return [...prev, product];
    });
  };
  const placeOrder = async () => {
    if (!requireLogin()) return;
    if (cart.length === 0) {
      setModalMessage("Your cart is empty!");
      setModalVisible(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem("token");
      const items = cart.map((p) => ({
        productId: p.id,
        quantity: p.quantity || 1,
      }));

      const res = await axios.post(
        `${API_URL}/orders`,
        { items },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setOrders(res.data.items || res.data);
      setCart([]);
      setModalMessage("Order placed successfully!");
      setModalVisible(true);
    } catch (err) {
      console.log(err);
      setModalMessage("Could not place order");
      setModalVisible(true);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
    setCart([]);
    setOrders([]);
    setFavorites([]);
    router.push("/");
  };

  const heroHeight = width > 800 ? 500 : 420;

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.topBar}>
        <Pressable onPress={() => setSidebarOpen(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <Text style={styles.title}>FashionStore</Text>
        <View style={{ width: 200, marginHorizontal: 10 }}>
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
              <Pressable
                onPress={() => setSidebarOpen(true)}
                style={{ marginRight: 10 }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  ♥ ({favorites.length})
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setSidebarOpen(true)}
                style={{ marginRight: 10 }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  🛒 ({cart.length})
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setOrdersModalVisible(true)}
                style={{ marginRight: 10 }}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>
                  📦 ({orders.length})
                </Text>
              </Pressable>
            </>
          )}
          {role ? (
            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.btnText}>Logout</Text>
            </Pressable>
          ) : (
            <>
              <Pressable
                style={styles.loginBtn}
                onPress={() => router.push("/login")}
              >
                <Text style={styles.btnText}>Login</Text>
              </Pressable>
              <Pressable
                style={styles.registerBtn}
                onPress={() => router.push("/register")}
              >
                <Text style={styles.btnText}>Register</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>

      {/* MAIN CONTENT */}
      <ScrollView style={styles.container}>
        {/* HERO */}
        <ImageBackground
          source={require("../assets/fashion-trends-GettyImages-1457816153-d2982e954afe4b42bf5587f087da90d4.jpg")}
          style={{
            width: "100%",
            height: heroHeight,
            justifyContent: "center",
          }}
          resizeMode="cover"
        >
          <View style={styles.heroOverlay}>
            <Text
              style={[styles.heroTitle, { fontSize: width > 800 ? 48 : 36 }]}
            >
              Welcome to FashionStore
            </Text>
            <Text
              style={[styles.heroSubtitle, { fontSize: width > 800 ? 24 : 18 }]}
            >
              Discover the newest fashion trends!
            </Text>
          </View>
        </ImageBackground>
<View style={styles.productsSection}>
  <Text style={styles.sectionTitle}>Popular Products</Text>

  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={styles.horizontalList}
  >
    {filteredProducts.map((product) => (
      <ProductCard
        key={product.id}
        product={product}
        addToCart={addToCart}
        addToFavorites={addToFavorites}
      />
    ))}
  </ScrollView>
</View>




        {/* FOOTER */}
        <Footer />
      </ScrollView>

      {sidebarOpen && (
        <View style={styles.overlay}>
          <View style={styles.sidebar}>
            <Text style={styles.logo}>FashionStore</Text>

            {/* Profile button */}
            {role && (
              <Pressable
                style={styles.sidebarItem}
                onPress={() => {
                  router.push("/user/Profile");
                  setSidebarOpen(false);
                }}
              >
                <Text style={styles.sidebarText}>Profile</Text>
              </Pressable>
            )}

            <Text style={styles.sidebarTitle}>
              Favorites ({favorites.length})
            </Text>
            {favorites.length === 0 ? (
              <Text>No favorites yet.</Text>
            ) : (
              favorites.map((p) => (
                <View key={p.id} style={styles.cartItem}>
                  <Text style={{ flex: 1 }}>{p.name}</Text>
                </View>
              ))
            )}

            <Text style={styles.sidebarTitle}>Cart ({cart.length})</Text>
            {cart.length === 0 ? (
              <Text>Cart is empty.</Text>
            ) : (
              cart.map((p) => (
                <View key={p.id} style={styles.cartItem}>
                  <Text style={{ flex: 1 }}>{p.name}</Text>
                  <View style={styles.quantityControls}>
                    <Pressable
                      onPress={() => changeQuantity(p.id, -1)}
                      style={styles.qtyBtn}
                    >
                      <Text>-</Text>
                    </Pressable>
                    <Text style={styles.qtyText}>{p.quantity}</Text>
                    <Pressable
                      onPress={() => changeQuantity(p.id, 1)}
                      style={styles.qtyBtn}
                    >
                      <Text>+</Text>
                    </Pressable>
                  </View>
                  <Pressable
                    onPress={() => removeFromCart(p.id)}
                    style={styles.removeBtn}
                  >
                    <Text>Remove</Text>
                  </Pressable>
                  <Pressable onPress={placeOrder} style={styles.orderBtn}>
                    <Text>Place Order</Text>
                  </Pressable>
                </View>
              ))
            )}

            <Pressable
              style={styles.closeBtn}
              onPress={() => setSidebarOpen(false)}
            >
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
            <Pressable
              style={styles.modalBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cardBtnText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ORDERS MODAL */}
      <Modal visible={ordersModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: "80%" }]}>
            <Text style={{ fontWeight: "700", fontSize: 18, marginBottom: 10 }}>
              My Orders ({orders.length})
            </Text>
            <ScrollView style={{ maxHeight: 300 }}>
              {orders.length === 0 ? (
                <Text>No orders yet.</Text>
              ) : (
                orders.map((p) => (
                  <View
                    key={p.id}
                    style={{
                      marginBottom: 10,
                      padding: 10,
                      borderWidth: 1,
                      borderRadius: 8,
                      borderColor: "#ccc",
                    }}
                  >
                    <Text style={{ fontWeight: "600" }}>{p.name}</Text>
                    {p.quantity && <Text>Quantity: {p.quantity}</Text>}
                    <Text>Price: ${p.price}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <Pressable
              style={[styles.modalBtn, { marginTop: 10 }]}
              onPress={() => setOrdersModalVisible(false)}
            >
              <Text style={styles.cardBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  menuIcon: { color: "#fff", fontSize: 28 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  searchInput: {
    backgroundColor: "#555",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 35,
    fontSize: 14,
    color: "#fff",
  },
  container: { flex: 1, backgroundColor: "#fff" },
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: { color: "#fff", marginBottom: 20, textAlign: "center" },
  loginBtn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
  },
  registerBtn: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
  },
  logoutBtn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  btnText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  section: { paddingHorizontal: 20, marginTop: 30, marginBottom: 30 },
  sectionTitle: { fontWeight: "700", marginBottom: 8, color: "#111" },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sidebar: {
    width: "70%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 25,
  },
  logo: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  sidebarTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 5,
  },
  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },
  qtyBtn: { padding: 5, backgroundColor: "#ccc", borderRadius: 5 },
  qtyText: { marginHorizontal: 5 },
  removeBtn: {
    padding: 5,
    backgroundColor: "#ff4d6d",
    borderRadius: 5,
    marginLeft: 5,
  },
  orderBtn: {
    padding: 5,
    backgroundColor: "#1e90ff",
    borderRadius: 5,
    marginLeft: 5,
  },
  closeBtn: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#000",
    borderRadius: 10,
  },
  closeText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: 250,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: "#111",
  },
  modalBtn: {
    backgroundColor: "#000",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cardBtnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  sidebarItem: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 10,
    backgroundColor: "#00d1b2",
    borderRadius: 8,
  },
productsSection: {
  marginTop: 30,
  paddingLeft: 15,
},
horizontalList: {
  paddingRight: 20,
},
sidebarText: { color: "#121212", fontWeight: "700" },
});
