import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface FavoriteItem {
  id: number;
  Product: {
    id: number;
    name: string;
    price: number;
    image: string;
  };
}

export default function Favorites() {
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/favorites', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Cannot fetch favorites');
    }
  };

  const removeFavorite = async (productId: number) => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFavorites();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Cannot remove favorite');
    }
  };

  useEffect(() => { fetchFavorites(); }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Favorites</Text>
      {favorites.length === 0 ? (
        <Text style={{ padding: 20 }}>No favorite products</Text>
      ) : (
        favorites.map(item => (
          <View key={item.id} style={styles.item}>
            <Text style={styles.name}>{item.Product.name}</Text>
            <Text>Price: ${item.Product.price}</Text>
            <Pressable style={styles.btn} onPress={() => removeFavorite(item.Product.id)}>
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
  btn: { backgroundColor: '#1f1f1f', padding: 10, borderRadius: 8, marginTop: 8 },
  btnText: { color: '#fff', textAlign: 'center', fontWeight: '700' },
});
