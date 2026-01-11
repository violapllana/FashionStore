import { useEffect, useState } from "react";
import { View, ScrollView, StyleSheet, Text, Pressable } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import TopBar from "./TopBar";
import UserSidebar from "./UserSidebar";
import { router } from "expo-router";
import WeatherWidget from "./weather";

export default function UserLayout({ children, role, setRole, searchQuery, setSearchQuery, onLogout }: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    if (!role) return;
    AsyncStorage.getItem("token").then(async (token) => {
      if (!token) return;
      try {
        const [cartRes, favRes, ordersRes] = await Promise.all([
          axios.get(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/favorites`, { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        setCart(cartRes.data || []);
        setFavorites(favRes.data || []);
        setOrders(ordersRes.data || []);
      } catch (err) {
        console.error(err);
      }
    });
  }, [role]);

  return (
    <View style={styles.container}>
      {/* TopBar */}
    <TopBar
  role={role}
  favoritesCount={favorites.length}
  cartCount={cart.length}
  ordersCount={orders.length}
  setRole={setRole}
  setCart={setCart}
  setFavorites={setFavorites}
  setOrders={setOrders}
  onMenuPress={() => setSidebarOpen(true)}
  onLogout={onLogout}
/>


      <ScrollView contentContainerStyle={styles.scrollContent}>
        {children}

        <View style={footerStyles.footer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ alignItems: "flex-start" }}
          >
            {/* WEATHER */}
            <View style={footerStyles.column}>
              <Text style={footerStyles.heading}>Weather</Text>
              <WeatherWidget />
            </View>

            {/* CONTACT */}
            <View style={footerStyles.column}>
              <Text style={footerStyles.heading}>Contact</Text>
              <Text style={footerStyles.text}>contact@fashionstore.com</Text>
              <Text style={footerStyles.text}>+383 38 616 161</Text>
              <Text style={footerStyles.text}>+383 46 470 047 (Viber / WhatsApp)</Text>
              <Text style={footerStyles.text}>
                Magjistralja Prishtinë–Ferizaj, Lapnasellë, Prishtinë, Kosovo
              </Text>
            </View>

            {/* QUICK LINKS */}
            <View style={footerStyles.column}>
              <Text style={footerStyles.heading}>Quick Links</Text>
              <Pressable onPress={() => router.push("/user/cart")}>
                <Text style={footerStyles.link}>Cart</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/user/orders")}>
                <Text style={footerStyles.link}>Orders</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/user/favorite")}>
                <Text style={footerStyles.link}>Favorite</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/user/productsList")}>
                <Text style={footerStyles.link}>Products</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/user/contact")}>
                <Text style={footerStyles.link}>Contact</Text>
              </Pressable>
              <Pressable onPress={() => router.push("/user/Profile")}>
                <Text style={footerStyles.link}>Profile</Text>
              </Pressable>
            </View>
          </ScrollView>
          <Text style={footerStyles.copyright}>
            © 2026 FashionStore. All rights reserved.
          </Text>
        </View>
      </ScrollView>

      {/* Sidebar */}
      <UserSidebar
        visible={sidebarOpen}
        favorites={favorites}
        cart={cart}
        orders={orders}
        onClose={() => setSidebarOpen(false)}
       onRemoveFavorite={async (productId: number) => {
  try {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    await axios.delete(`${API_URL}/favorites/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // filtro favorites lokal me ProductId
    setFavorites((f) => f.filter((i) => (i.Product?.id || i.ProductId) !== productId));
  } catch (err) {
    console.error(err);
  }
}}

        onRemoveFromCart={async (id: number) => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;
            await axios.delete(`${API_URL}/cart/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setCart((c) => c.filter((i) => i.id !== id));
          } catch (err) {
            console.error(err);
          }
        }}
        onChangeQty={async (item: any, delta: number) => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;
            const newQty = (item.quantity || 1) + delta;

            if (newQty < 1) {
              await axios.delete(`${API_URL}/cart/${item.id}`, { headers: { Authorization: `Bearer ${token}` } });
              setCart((c) => c.filter((i) => i.id !== item.id));
            } else {
              await axios.put(`${API_URL}/cart/${item.id}`, { quantity: newQty }, { headers: { Authorization: `Bearer ${token}` } });
              setCart((c) => c.map((i) => (i.id === item.id ? { ...i, quantity: newQty } : i)));
            }
          } catch (err) {
            console.error(err);
          }
        }}
        onOrder={async (item?: any) => {
          try {
            const token = await AsyncStorage.getItem("token");
            if (!token) return;

            if (item) {
              // Place order for single item
              await axios.post(`${API_URL}/orders`, { items: [{ productId: item.Product?.id || item.id, quantity: item.quantity }] }, { headers: { Authorization: `Bearer ${token}` } });
              setOrders((o) => [...o, item]);
              setCart((c) => c.filter((i) => i.id !== item.id));
            } else {
              // Place order for all cart
              await Promise.all(cart.map((cItem) =>
                axios.post(`${API_URL}/orders`, { items: [{ productId: cItem.Product?.id || cItem.id, quantity: cItem.quantity }] }, { headers: { Authorization: `Bearer ${token}` } })
              ));
              setOrders((o) => [...o, ...cart]);
              setCart([]);
            }
          } catch (err) {
            console.error(err);
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContent: { flexGrow: 1, paddingBottom: 16 },
});

const footerStyles = StyleSheet.create({
  footer: { width: "100%", backgroundColor: "#111", padding: 16, marginTop: 24 },
  column: { marginRight: 24 },
  heading: { fontWeight: "700", fontSize: 16, marginBottom: 12, color: "#fff" },
  text: { fontSize: 14, marginBottom: 6, color: "#ccc" },
  link: { fontSize: 14, color: "#1e90ff", marginBottom: 6 },
  copyright: { marginTop: 16, textAlign: "center", fontSize: 12, color: "#888" },
});
