import { View, Text, ScrollView, StyleSheet, Pressable, Alert } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import UserLayout from "./components/UserLayout";

const API_URL = "http://localhost:5000/api/orders";

export default function MyOrders() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      setOrders(res.data);
    } catch (err) {
      Alert.alert("Error", "Cannot fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = (orderId: number) => {
    Alert.alert(
      "Delete Order",
      "Are you sure you want to delete this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const token = await AsyncStorage.getItem("token");
            await axios.delete(`${API_URL}/${orderId}`, { headers: { Authorization: `Bearer ${token}` } });
            setOrders(prev => prev.filter(o => o.id !== orderId));
          },
        },
      ]
    );
  };

  useEffect(() => {
    AsyncStorage.getItem("role").then(setRole);
    fetchOrders();
  }, []);

  const handleLogout = async () => { await AsyncStorage.clear(); setRole(null); };

  if (loading) {
    return (
      <UserLayout role={role} cart={[]} favorites={[]} orders={[]} searchQuery="" setSearchQuery={() => {}} onLogout={handleLogout} onRemoveFavorite={() => {}} onChangeQty={() => {}} onOrder={() => {}}>
        <View style={styles.center}><Text style={styles.loading}>Loading your orders...</Text></View>
      </UserLayout>
    );
  }

  if (!orders.length) {
    return (
      <UserLayout role={role} cart={[]} favorites={[]} orders={[]} searchQuery="" setSearchQuery={() => {}} onLogout={handleLogout} onRemoveFavorite={() => {}} onChangeQty={() => {}} onOrder={() => {}}>
        <View style={styles.center}><Text style={styles.empty}>No orders yet 🛍️</Text></View>
      </UserLayout>
    );
  }

  return (
    <UserLayout role={role} cart={[]} favorites={[]} orders={orders} searchQuery="" setSearchQuery={() => {}} onLogout={handleLogout} onRemoveFavorite={() => {}} onChangeQty={() => {}} onOrder={() => {}}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <Text style={styles.pageTitle}>My Orders</Text>
        {orders.map(order => (
          <View key={order.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.orderId}>Order #{order.id}</Text>
              <View style={[styles.badge, order.status === "completed" ? styles.completed : styles.pending]}>
                <Text style={styles.badgeText}>{order.status || "Pending"}</Text>
              </View>
            </View>
            {order.items.map((item: any) => (
              <View key={item.id} style={styles.itemRow}>
                <Text style={styles.product}>{item.Product?.name}</Text>
                <Text style={styles.price}>{item.quantity} × €{item.price}</Text>
              </View>
            ))}
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalPrice}>€{order.totalPrice}</Text>
            </View>
        
          </View>
        ))}
      </ScrollView>
    </UserLayout>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f6f6f6", padding: 16 },
  pageTitle: { fontSize: 26, fontWeight: "700", marginBottom: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  loading: { fontSize: 16, color: "#777" },
  empty: { fontSize: 18, fontWeight: "600" },
  card: { backgroundColor: "#fff", borderRadius: 16, padding: 16, marginBottom: 20, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, elevation: 4 },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  orderId: { fontSize: 16, fontWeight: "600" },
  badge: { paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  pending: { backgroundColor: "#FFF1C1" },
  completed: { backgroundColor: "#D1FADF" },
  badgeText: { fontSize: 12, fontWeight: "600" },
  itemRow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 6 },
  product: { fontSize: 14, fontWeight: "500" },
  price: { fontSize: 14, color: "#555" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 12 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  totalLabel: { fontSize: 16, fontWeight: "600" },
  totalPrice: { fontSize: 18, fontWeight: "700" },
  deleteBtn: { backgroundColor: "#111", paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  deleteText: { color: "#fff", fontWeight: "600" },
});
