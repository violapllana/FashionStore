import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Alert, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface OrderItem {
  id: number;
  quantity: number;
  price: number;
  Product: {
    id: number;
    name: string;
    price: number;
    imageUrl?: string;
  };
}

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  items: OrderItem[];
  User?: { email: string };
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      if (!token) {
        Alert.alert('Error', 'Please login first');
        setLoading(false);
        return;
      }

      const res = await axios.get('http://localhost:5000/api/orders', {
        headers: { Authorization: `Bearer ${token}` },
      });

      const fetchedOrders = Array.isArray(res.data) ? res.data : [res.data];
      setOrders(fetchedOrders);

    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const deleteOrder = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      await axios.delete(`http://localhost:5000/api/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Order deleted');
      setOrders(prev => prev.filter(order => order.id !== id));
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not delete order');
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (!token) return;

      await axios.put(`http://localhost:5000/api/orders/${id}`, { status }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Alert.alert('Success', 'Status updated');
      setOrders(prev => prev.map(order => order.id === id ? { ...order, status } : order));
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not update status');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Orders</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#00d1b2" style={{ marginTop: 50 }} />
      ) : orders.length === 0 ? (
        <Text style={styles.noOrders}>No orders found</Text>
      ) : (
        <ScrollView>
          {orders.map(order => (
            <View key={order.id} style={styles.orderCard}>
              <Text style={styles.orderHeader}>Order #{order.id}</Text>
              {order.User?.email && <Text style={styles.orderStatus}>User: {order.User.email}</Text>}
              <Text style={styles.orderStatus}>Status: {order.status || 'pending'}</Text>
              <Text style={styles.orderTotal}>Total: ${order.totalPrice?.toFixed(2) || 0}</Text>

              {order.items && order.items.length > 0 ? (
                order.items.map(item => (
                  <View key={item.id} style={styles.itemRow}>
                    <Text style={styles.itemName}>{item.Product?.name || 'Unknown'}</Text>
                    <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
                    <Text style={styles.itemPrice}>Price: ${item.price}</Text>
                  </View>
                ))
              ) : (
                <Text style={{ color: '#fff' }}>No items</Text>
              )}

              <View style={styles.actions}>
                <Pressable
                  style={styles.buttonDelete}
                  onPress={() => deleteOrder(order.id)}
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </Pressable>

                <Pressable
                  style={styles.buttonEdit}
                  onPress={() => {
                    const newStatus = order.status === "pending" ? "completed" : "pending";
                    updateStatus(order.id, newStatus);
                  }}
                >
                  <Text style={styles.buttonText}>Toggle Status</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 32, fontWeight: '700', color: '#00d1b2', marginBottom: 20 },
  noOrders: { color: '#fff', marginTop: 50, textAlign: 'center', fontSize: 18 },
  orderCard: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 15, marginBottom: 20 },
  orderHeader: { fontSize: 20, fontWeight: '700', color: '#00d1b2', marginBottom: 5 },
  orderStatus: { fontSize: 16, color: '#fff', marginBottom: 5 },
  orderTotal: { fontSize: 16, color: '#fff', marginBottom: 10 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 5 },
  itemName: { color: '#fff', flex: 2 },
  itemQty: { color: '#fff', flex: 1, textAlign: 'center' },
  itemPrice: { color: '#fff', flex: 1, textAlign: 'right' },
  actions: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  buttonDelete: { backgroundColor: '#ff4d4d', padding: 8, borderRadius: 8, flex: 1, marginRight: 5 },
  buttonEdit: { backgroundColor: '#00d1b2', padding: 8, borderRadius: 8, flex: 1, marginLeft: 5 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});
