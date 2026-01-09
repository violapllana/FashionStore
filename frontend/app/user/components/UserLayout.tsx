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
    AsyncStorage.getItem("token").then(async (t) => {
      if (!t) return;
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

  return (
    <View style={styles.container}>
      {/* TopBar */}
      <TopBar
        role={role}
        favoritesCount={favorites.length}
        cartCount={cart.length}
        ordersCount={orders.length}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onMenuPress={() => setSidebarOpen(true)}
        onLogout={onLogout}
      />

      {/* Main content + footer */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {children}

        {/* Footer brenda scrollit */}
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
        onRemoveFavorite={(id: number) =>
          setFavorites((f) => f.filter((i) => i.id !== id))
        }
        onChangeQty={(item: any, delta: number) => {
          const newCart = cart.map((c) =>
            c.id === item.id ? { ...c, quantity: (c.quantity || 1) + delta } : c
          );
          setCart(newCart);
        }}
        onOrder={() => setOrders([...orders, ...cart])}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 16,
  },
});

const footerStyles = StyleSheet.create({
  footer: {
    width: "100%",
    backgroundColor: "#111",
    padding: 16,
    marginTop: 24, // hiq position absolute
  },
  column: { marginRight: 24 },
  heading: { fontWeight: "700", fontSize: 16, marginBottom: 12, color: "#fff" },
  text: { fontSize: 14, marginBottom: 6, color: "#ccc" },
  link: { fontSize: 14, color: "#1e90ff", marginBottom: 6 },
  copyright: { marginTop: 16, textAlign: "center", fontSize: 12, color: "#888" },
});

