import { useEffect, useState } from "react";
import { View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TopBar from "./TopBar";
import UserSidebar from "./UserSidebar";
import axios from "axios";

export default function UserLayout({
  children,
  role,
  setRole,
  searchQuery,
  setSearchQuery,
  onLogout,
}: any) {
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const API_URL = "http://localhost:5000/api";

  // Ngarko cart, favorites, orders si Home page
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
    <View style={{ flex: 1 }}>
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

      {children}

      <UserSidebar
        visible={sidebarOpen}
        favorites={favorites}
        cart={cart}
        orders={orders}
        onClose={() => setSidebarOpen(false)}
        onRemoveFavorite={(id: number) => setFavorites(f => f.filter(i => i.id !== id))}
        onChangeQty={(item: any, delta: number) => {
          const newCart = cart.map(c =>
            c.id === item.id ? { ...c, quantity: (c.quantity || 1) + delta } : c
          );
          setCart(newCart);
        }}
        onOrder={() => setOrders([...orders, ...cart])}
      />
    </View>
  );
}
