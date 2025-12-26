import { useEffect, useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet, Modal, TextInput } from "react-native";
import axios from "axios";
import ProductCard from "../productCard";
import Header from "../header";
import Footer from "../footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface Product {
  quantity?: number;
  id: number;
  name: string;
  description: string;
  image?: string;
  price: number;
  category?: string;
  gender?: string;
  Product?: { name: string }; // from backend include
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Product[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    AsyncStorage.getItem("role").then((r) => setRole(r));
    axios.get(`${API_URL}/products`).then((res) => setProducts(res.data || []));
  }, []);

  useEffect(() => {
    if (!role) return;
    const token = AsyncStorage.getItem("token");
    token?.then(async (t) => {
      try {
        const [cartRes, favRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${t}` } }),
          axios.get(`${API_URL}/favorites`, { headers: { Authorization: `Bearer ${t}` } }),
          axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${t}` } }),
        ]);
        setCart(cartRes.data || []);
        setFavorites(favRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.log(err);
      }
    });
  }, [role]);

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
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(`${API_URL}/cart`, { productId: product.id, quantity: 1 }, { headers: { Authorization: `Bearer ${token}` } });
      // refresh cart from backend
      const res = await axios.get(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${token}` } });
      setCart(res.data || []);
      setModalMessage(`${product.name} added to cart!`);
      setModalVisible(true);
    } catch (err) {
      console.log(err);
      setModalMessage("Could not add to cart");
      setModalVisible(true);
    }
  };

  const addToFavorites = async (product: Product) => {
    if (!(await requireLogin())) return;
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(`${API_URL}/favorites`, { productId: product.id }, { headers: { Authorization: `Bearer ${token}` } });
      const res = await axios.get(`${API_URL}/favorites`, { headers: { Authorization: `Bearer ${token}` } });
      setFavorites(res.data || []);
      setModalMessage(`${product.name} added to favorites!`);
      setModalVisible(true);
    } catch (err) {
      setModalMessage("Could not add to favorites");
      setModalVisible(true);
    }
  };

  const removeFromFavorites = async (productId: number) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    await axios.delete(`${API_URL}/favorites/${productId}`, { headers: { Authorization: `Bearer ${token}` } });
    const res = await axios.get(`${API_URL}/favorites`, { headers: { Authorization: `Bearer ${token}` } });
    setFavorites(res.data || []);
  };

  const changeCartQuantity = async (item: Product, delta: number) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    const newQuantity = (item.quantity || 1) + delta;
    if (newQuantity <= 0) {
      // remove item if quantity <=0
      await axios.delete(`${API_URL}/cart/${item.id}`, { headers: { Authorization: `Bearer ${token}` } });
    } else {
      await axios.put(`${API_URL}/cart/${item.id}`, { quantity: newQuantity }, { headers: { Authorization: `Bearer ${token}` } });
    }
    const res = await axios.get(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${token}` } });
    setCart(res.data || []);
  };
const placeOrder = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    setModalMessage("Please login to place an order");
    setModalVisible(true);
    return;
  }

  if (cart.length === 0) {
    setModalMessage("Cart is empty!");
    setModalVisible(true);
    return;
  }

  try {
   const res = await axios.post(`${API_URL}/orders`, {}, { headers: { Authorization: `Bearer ${token}` } });


    setOrders([res.data, ...orders]);
    setCart([]); // Pastro frontend cart
    setModalMessage("Order placed successfully!");
    setModalVisible(true);
  } catch (err: any) {
    console.log(err.response?.data || err);
    setModalMessage(err.response?.data?.message || "Could not place order");
    setModalVisible(true);
  }
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
        onLogout={async () => { await AsyncStorage.clear(); setRole(null); router.push("/"); }}
        onOrdersPress={() => setOrdersModalVisible(true)}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>All Products</Text>
        <View style={styles.grid}>
          {products.map((p) =>
            p ? (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                addToFavorites={addToFavorites}
                favorites={favorites}
              />
            ) : null
          )}
        </View>
        <Footer />
      </ScrollView>

      {/* Sidebar */}
      {sidebarOpen && (
        <View style={styles.sidebar}>
          <Text style={styles.sidebarTitle}>Cart</Text>
          <ScrollView>
            {cart.length > 0 ? (
              cart.map((item) => (
                <View key={item.id} style={styles.sidebarItem}>
                  <Text>{item.Product?.name} x {item.quantity}</Text>
                  <View style={{ flexDirection: "row" }}>
                    <Pressable onPress={() => changeCartQuantity(item, 1)} style={styles.qtyBtn}><Text>+</Text></Pressable>
                    <Pressable onPress={() => changeCartQuantity(item, -1)} style={styles.qtyBtn}><Text>-</Text></Pressable>
                  </View>
                </View>
              ))
            ) : (<Text>No items in cart</Text>)}
          </ScrollView>
      <Pressable style={styles.cardBtn} onPress={placeOrder}>
  <Text style={styles.cardBtnText}>Place Order</Text>
</Pressable>


          <Text style={styles.sidebarTitle}>Favorites</Text>
          <ScrollView>
            {favorites.length > 0 ? (
              favorites.map((item) => (
                <View key={item.id} style={styles.sidebarItem}>
                  <Text>{item.Product?.name}</Text>
                  <Pressable onPress={() => removeFromFavorites(item.ProductId || 0)} style={styles.removeBtn}>
                    <Text style={{ color: "#fff" }}>Remove</Text>
                  </Pressable>
                </View>
              ))
            ) : (<Text>No favorites yet</Text>)}
          </ScrollView>

          <Pressable style={styles.closeBtn} onPress={() => setSidebarOpen(false)}>
            <Text style={{ color: "#fff" }}>Close</Text>
          </Pressable>
        </View>
      )}

      {/* Modal */}
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

      {/* Orders Modal */}
      <Modal visible={ordersModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Your Orders</Text>
            <ScrollView>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <View key={order.id} style={styles.orderItem}>
                    <Text>Order #{order.id}</Text>
                    {order.items?.map((i: any) => (
                      <Text key={i.id}>{i.Product?.name} x {i.quantity}</Text>
                    ))}
                  </View>
                ))
              ) : (<Text>No orders yet</Text>)}
            </ScrollView>
            <Pressable style={styles.modalBtn} onPress={() => setOrdersModalVisible(false)}>
              <Text style={styles.cardBtnText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", margin: 20 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between", paddingHorizontal: 12, paddingBottom: 30 },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.5)" },
  modalContent: { backgroundColor: "#fff", padding: 20, borderRadius: 12, alignItems: "center", maxHeight: "80%" },
  modalText: { fontSize: 16, marginBottom: 15, textAlign: "center", color: "#111" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 10 },
  modalBtn: { backgroundColor: "#000", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cardBtnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  sidebar: { position: "absolute", top: 0, right: 0, width: "80%", height: "100%", backgroundColor: "#f5f5f5", padding: 15, zIndex: 10 },
  sidebarTitle: { fontSize: 20, fontWeight: "700", marginVertical: 10 },
  sidebarItem: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginVertical: 5 },
  qtyBtn: { backgroundColor: "#ccc", padding: 5, marginHorizontal: 3, borderRadius: 5 },
  removeBtn: { backgroundColor: "red", padding: 5, borderRadius: 5 },
  closeBtn: { backgroundColor: "#000", padding: 10, marginTop: 15, borderRadius: 8, alignItems: "center" },
  orderBtn: { backgroundColor: "green", padding: 10, marginVertical: 10, borderRadius: 8, alignItems: "center" },
  orderItem: { marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#ccc", paddingBottom: 5 },
  cardBtn: { backgroundColor: "#14532d", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, marginVertical: 10, alignItems: "center" }
});
