import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  Modal,
} from "react-native";
import axios from "axios";
import ProductCard from "../productCard";
import Header from "../header";
import Footer from "../footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface Product {
  quantity: number;
  id: number;
  name: string;
  description: string;
  image: string;
  price: number;
  category?: string;
  gender?: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"low" | "high" | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const API_URL = "http://localhost:5000/api";

  // 🔹 Fetch products
  useEffect(() => {
    AsyncStorage.getItem("role").then((r) => setRole(r));
    axios.get(`${API_URL}/products`).then((res) => {
      setProducts(res.data.products || res.data);
    });
  }, []);

  const filteredProducts = products
    .filter((p) => {
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedGender && p.gender !== selectedGender) return false;
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
      return true;
    })
    .sort((a, b) => {
      if (sortOrder === "low") return a.price - b.price;
      if (sortOrder === "high") return b.price - a.price;
      return 0;
    });

  // 🔹 Cart / Favorites / Orders functions
  const requireLogin = async () => {
    const token = await AsyncStorage.getItem("token");
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

  const addToCart = async (product: Product) => {
    if (!(await requireLogin())) return;
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

  const addToFavorites = async (product: Product) => {
    if (!(await requireLogin())) return;
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

  const removeFromCart = (id: number) =>
    setCart((prev) => prev.filter((p) => p.id !== id));

  const changeQuantity = (id: number, delta: number) =>
    setCart((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) } : p
      )
    );
  const placeOrder = async () => {
  if (!(await requireLogin())) return;
  if (cart.length === 0) {
    setModalMessage("Your cart is empty!");
    setModalVisible(true);
    return;
  }

  try {
    const token = await AsyncStorage.getItem("token");

    // Shto price tek items që dërgojmë në backend
    const items = cart.map((p) => ({
      productId: p.id,
      quantity: p.quantity || 1,
      price: p.price, // ky është çelësi
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
    setFavorites([]);
    setOrders([]);
    router.push("/");
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        title="FashionStore"
        role={role}
        cart={cart}
        favorites={favorites}
        orders={orders}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onMenuPress={() => setSidebarOpen(true)}
        onLogout={handleLogout}
        onOrdersPress={() => setOrdersModalVisible(true)}
      />

      {/* PRODUCTS GRID */}
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>All Products</Text>

        {/* CATEGORY FILTER */}
        <View style={styles.filtersRow}>
          {["Clothing", "Footwear", "Accessories"].map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCategory(cat === selectedCategory ? null : cat)}
              style={[styles.filterChip, selectedCategory === cat && styles.filterActive]}
            >
              <Text style={[styles.filterText, selectedCategory === cat && styles.filterTextActive]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* GENDER FILTER */}
        <View style={styles.filtersRow}>
          {["Men", "Women", "Kids"].map((g) => (
            <Pressable
              key={g}
              onPress={() => setSelectedGender(g === selectedGender ? null : g)}
              style={[styles.filterChip, selectedGender === g && styles.filterActive]}
            >
              <Text style={[styles.filterText, selectedGender === g && styles.filterTextActive]}>
                {g}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* PRICE SORT */}
        <View style={styles.filtersRow}>
          <Pressable
            onPress={() => setSortOrder("low")}
            style={[styles.filterChip, sortOrder === "low" && styles.filterActive]}
          >
            <Text style={[styles.filterText, sortOrder === "low" && styles.filterTextActive]}>
              Lowest Price
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSortOrder("high")}
            style={[styles.filterChip, sortOrder === "high" && styles.filterActive]}
          >
            <Text style={[styles.filterText, sortOrder === "high" && styles.filterTextActive]}>
              Highest Price
            </Text>
          </Pressable>
        </View>

 <View style={styles.grid}>
  {filteredProducts.map((product) => (
    <ProductCard
      key={product.id}
      product={product}
      addToCart={addToCart}
      addToFavorites={addToFavorites}
    />
  ))}
</View>

        <Footer />
      </ScrollView>

      {/* SIDEBAR */}
      {sidebarOpen && (
        <View style={styles.overlay}>
          <View style={styles.sidebar}>
            <Text style={styles.logo}>FashionStore</Text>

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

            <Text style={styles.sidebarTitle}>Favorites ({favorites.length})</Text>
            {favorites.length === 0 ? (
              <Text>No favorites yet.</Text>
            ) : (
              favorites.map((p) => (
                <View key={p.id} style={styles.cartItem}>
                  <Text>{p.name}</Text>
                </View>
              ))
            )}

            <Text style={styles.sidebarTitle}>Cart ({cart.length})</Text>
            {cart.length === 0 ? (
              <Text>Cart is empty.</Text>
            ) : (
              cart.map((p) => (
                <View key={p.id} style={styles.cartItem}>
                  <Text>{p.name}</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Pressable onPress={() => changeQuantity(p.id, -1)}>
                      <Text>-</Text>
                    </Pressable>
                    <Text style={{ marginHorizontal: 5 }}>{p.quantity}</Text>
                    <Pressable onPress={() => changeQuantity(p.id, 1)}>
                      <Text>+</Text>
                    </Pressable>
                  </View>
                  <Pressable onPress={() => removeFromCart(p.id)}>
                    <Text>Remove</Text>
                  </Pressable>
                  <Pressable onPress={placeOrder}>
                    <Text>Place Order</Text>
                  </Pressable>
                </View>
              ))
            )}

            <Pressable onPress={() => setSidebarOpen(false)} style={styles.closeBtn}>
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}

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
                  <View key={p.id} style={{ marginBottom: 10, padding: 10, borderWidth: 1, borderRadius: 8, borderColor: "#ccc" }}>
                    <Text style={{ fontWeight: "600" }}>{p.name}</Text>
                    {p.quantity && <Text>Quantity: {p.quantity}</Text>}
                    <Text>Price: ${p.price}</Text>
                  </View>
                ))
              )}
            </ScrollView>
            <Pressable style={[styles.modalBtn, { marginTop: 10 }]} onPress={() => setOrdersModalVisible(false)}>
              <Text style={styles.cardBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MESSAGE MODAL */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", margin: 20 },
  filtersRow: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginHorizontal: 16, marginBottom: 10 },
  filterChip: { borderWidth: 1, borderColor: "#e5e7eb", paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: "#fff" },
  filterActive: { backgroundColor: "#14532d", borderColor: "#14532d" },
  filterText: { fontSize: 13, color: "#111", fontWeight: "600" },
  filterTextActive: { color: "#fff" },
 grid: { 
  flexDirection: "row", 
  flexWrap: "wrap", 
  justifyContent: "space-between", 
  paddingHorizontal: 12, 
  paddingBottom: 30 
},


  overlay: { position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.3)" },
  sidebar: { width: "70%", height: "100%", backgroundColor: "#fff", padding: 25 },
  logo: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  sidebarTitle: { fontSize: 18, fontWeight: "700", marginTop: 10, marginBottom: 5 },
  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 10, justifyContent: "space-between" },
  closeBtn: { marginTop: 20, padding: 12, backgroundColor: "#000", borderRadius: 10 },
  closeText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  sidebarItem: { paddingVertical: 10, paddingHorizontal: 15, marginBottom: 10, backgroundColor: "#00d1b2", borderRadius: 8 },
  sidebarText: { color: "#121212", fontWeight: "700" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 12, alignItems: "center" },
  modalText: { fontSize: 16, marginBottom: 15, textAlign: "center", color: "#111" },
  modalBtn: { backgroundColor: "#000", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cardBtnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
