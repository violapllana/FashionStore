import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface CartItem {
  id: number;
  quantity: number;
  Product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

export default function Cart() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/cart', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Cannot fetch cart');
    }
  };

  const removeItem = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Cannot remove item');
    }
  };

  useEffect(() => { fetchCart(); }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Cart</Text>
      {cart.length === 0 ? (
        <Text style={{ padding: 20 }}>Your cart is empty</Text>
      ) : (
        cart.map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.name}>{item.Product.name}</Text>
            <Text>Price: ${item.Product.price}</Text>
            <Text>Quantity: {item.quantity}</Text>
            <Pressable style={styles.btn} onPress={() => removeItem(item.id)}>
              <Text style={styles.btnText}>Remove</Text>
            </Pressable>
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  title: { fontSize: 28, fontWeight: '700', marginBottom: 20 },
  item: { marginBottom: 15, padding: 15, backgroundColor: '#f5f5f5', borderRadius: 12 },
  name: { fontSize: 18, fontWeight: '600', marginBottom: 5 },
  btn: { backgroundColor: '#ff4d6d', padding: 10, borderRadius: 8, marginTop: 8 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
