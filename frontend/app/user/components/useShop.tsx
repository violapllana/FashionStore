import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "http://localhost:5000/api";

export function useShop() {
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  // Load initial data
  useEffect(() => {
    AsyncStorage.getItem("token").then(async (t) => {
      if (!t) return;
      try {
        const [c, f, o] = await Promise.all([
          axios.get(`${API_URL}/cart`, { headers: { Authorization: `Bearer ${t}` }}),
          axios.get(`${API_URL}/favorites`, { headers: { Authorization: `Bearer ${t}` }}),
          axios.get(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${t}` }}),
        ]);
        setCart(c.data || []);
        setFavorites(f.data || []);
        setOrders(o.data || []);
      } catch (err) {
        console.error(err);
      }
    });
  }, []);

  const addToCart = async (product: any) => {
    // ✅ Optimistic update
    setCart((prev) => {
      const existing = prev.find((p) => (p.Product?.id || p.id) === product.id);
      if (existing) {
        return prev.map((p) =>
          (p.Product?.id || p.id) === product.id
            ? { ...p, quantity: (p.quantity || 1) + 1 }
            : p
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });

    const t = await AsyncStorage.getItem("token");
    if (!t) return;
    try {
      await axios.post(`${API_URL}/cart`,
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${t}` } }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const addToFavorites = async (product: any) => {
    setFavorites((prev) => [...prev, product]);
    const t = await AsyncStorage.getItem("token");
    if (!t) return;
    try {
      await axios.post(`${API_URL}/favorites`,
        { productId: product.id },
        { headers: { Authorization: `Bearer ${t}` } }
      );
    } catch (err) {
      console.error(err);
    }
  };

  const placeOrder = async (item?: any) => {
    const t = await AsyncStorage.getItem("token");
    if (!t) return;

    if (item) {
      setOrders((prev) => [...prev, item]);
      setCart((c) => c.filter((i) => i.id !== item.id));
      await axios.post(`${API_URL}/orders`, { items: [{ productId: item.Product?.id || item.id, quantity: item.quantity }] }, { headers: { Authorization: `Bearer ${t}` } });
    } else {
      setOrders((prev) => [...prev, ...cart]);
      setCart([]);
      await Promise.all(cart.map((cItem) =>
        axios.post(`${API_URL}/orders`, { items: [{ productId: cItem.Product?.id || cItem.id, quantity: cItem.quantity }] }, { headers: { Authorization: `Bearer ${t}` } })
      ));
    }
  };

  return {
    cart,
    favorites,
    orders,
    addToCart,
    addToFavorites,
    placeOrder,
    setCart,
    setFavorites,
    setOrders,
  };
}
