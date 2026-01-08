import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api";

export function useShop() {
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("token").then(async (t) => {
      if (!t) return;
      const [c, f, o] = await Promise.all([
        axios.get(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${t}` }}),
        axios.get(`${API_URL}/favorites`, { headers: { Authorization: `Bearer ${t}` }}),
        axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${t}` }}),
      ]);
      setCart(c.data || []);
      setFavorites(f.data || []);
      setOrders(o.data || []);
    });
  }, []);

  const addToCart = async (product: any) => {
    const t = await AsyncStorage.getItem("token");
    if (!t) return;
    await axios.post(`${API_URL}/cart`,
      { productId: product.id, quantity: 1 },
      { headers: { Authorization: `Bearer ${t}` } }
    );
    const res = await axios.get(`${API_URL}/cart`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    setCart(res.data);
  };

  const addToFavorites = async (product: any) => {
    const t = await AsyncStorage.getItem("token");
    if (!t) return;
    await axios.post(`${API_URL}/favorites`,
      { productId: product.id },
      { headers: { Authorization: `Bearer ${t}` } }
    );
    const res = await axios.get(`${API_URL}/favorites`, {
      headers: { Authorization: `Bearer ${t}` },
    });
    setFavorites(res.data);
  };

  return {
    cart,
    favorites,
    orders,
    addToCart,
    addToFavorites,
  };
}
