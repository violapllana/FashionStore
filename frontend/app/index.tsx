import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ImageBackground,
  useWindowDimensions,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import UserLayout from "./user/components/UserLayout";
import ProductCard from "./productCard";

interface Product {
  id: number;
  name: string;
  description: string;
  image?: string;
  price: number;
  quantity?: number;
  Product?: { id: number; name: string };
}

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();

  const [role, setRole] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [cart, setCart] = useState<Product[]>([]);
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Product[]>([]);

  const API_URL = "http://localhost:5000/api";

useEffect(() => {
  AsyncStorage.getItem("role").then(setRole);

  axios
    .get(`${API_URL}/products`)
    .then((res) => {
      const now = new Date();
      const productsWithNewFlag = res.data.map((p: any) => {
        const createdAt = new Date(p.createdAt);
        const isNew = now.getTime() - createdAt.getTime() < 24 * 60 * 60 * 1000;
        return { ...p, isNew };
      });

      // Sorto: produktet NEW më parë, pastaj të vjetra sipas createdAt
      productsWithNewFlag.sort((a: any, b: any) => {
        if (a.isNew && !b.isNew) return -1;
        if (!a.isNew && b.isNew) return 1;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });

      setProducts(productsWithNewFlag || []);
      setFilteredProducts(productsWithNewFlag || []);
    })
    .catch((err) => console.log(err));

  if (role) fetchUserData();
}, [role]);


  const fetchUserData = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    try {
      const [cartRes, favRes, ordersRes] = await Promise.all([
        axios.get(`${API_URL}/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/favorites`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_URL}/orders`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setCart(cartRes.data || []);
      setFavorites(favRes.data || []);
      setOrders(ordersRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
    setCart([]);
    setFavorites([]);
    setOrders([]);
    router.push("/");
  };

  // Filter products based on search
  useEffect(() => {
    if (!searchQuery) setFilteredProducts(products);
    else
      setFilteredProducts(
        products.filter((p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
  }, [searchQuery, products]);

  const addToCart = async (product: Product) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `${API_URL}/cart`,
        { productId: product.id, quantity: 1 },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserData();
    } catch (err) {
      console.log(err);
    }
  };

  const addToFavorites = async (product: Product) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `${API_URL}/favorites`,
        { productId: product.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserData();
    } catch (err) {
      console.log(err);
    }
  };

  const changeCartQuantity = async (item: Product, delta: number) => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    try {
      const newQty = (item.quantity || 1) + delta;
      if (newQty <= 0) {
        await axios.delete(`${API_URL}/cart/${item.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.put(
          `${API_URL}/cart/${item.id}`,
          { quantity: newQty },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      fetchUserData();
    } catch (err) {
      console.log(err);
    }
  };

  const placeOrder = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;
    try {
      await axios.post(
        `${API_URL}/orders`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchUserData();
    } catch (err) {
      console.log(err);
    }
  };

  const heroHeight = width > 800 ? 500 : 420;

  function removeFromFavorites(id: any) {
    throw new Error("Function not implemented.");
  }

  return (
    <UserLayout
      role={role}
      cart={cart}
      favorites={favorites}
      orders={orders}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onLogout={handleLogout}
      onRemoveFavorite={(id: any) => removeFromFavorites(id)}
      onChangeQty={(item: Product, delta: number) =>
        changeCartQuantity(item, delta)
      }
      onOrder={placeOrder}
    >
      <ScrollView>
        <ImageBackground
          source={require("../assets/fashion-trends-GettyImages-1457816153-d2982e954afe4b42bf5587f087da90d4.jpg")}
          style={{
            width: "100%",
            height: heroHeight,
            justifyContent: "center",
          }}
        >
          <View style={styles.heroOverlay}>
            <Text
              style={[styles.heroTitle, { fontSize: width > 800 ? 48 : 36 }]}
            >
              Welcome to FashionStore
            </Text>
            <Text
              style={[styles.heroSubtitle, { fontSize: width > 800 ? 24 : 18 }]}
            >
              Discover the newest fashion trends!
            </Text>
          </View>
        </ImageBackground>

        <View style={styles.productsSection}>
          <Text style={styles.sectionTitle}>Popular Products</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalList}
          >
            {filteredProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                addToFavorites={addToFavorites}
              />
            ))}
          </ScrollView>
        </View>
        <Pressable
          style={styles.viewAllBtn}
          onPress={() => router.push("/user/productsList")}
        >
          <Text style={styles.viewAllBtnText}>View All Products</Text>
        </Pressable>
      </ScrollView>
    </UserLayout>
  );
}

const styles = StyleSheet.create({
  heroOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginBottom: 10,
  },
  heroSubtitle: { color: "#fff", marginBottom: 20, textAlign: "center" },
  sectionTitle: {
    fontWeight: "700",
    marginBottom: 8,
    color: "#111",
    fontSize: 18,
  },
  productsSection: { marginTop: 30, paddingLeft: 15 },
  horizontalList: { paddingRight: 20 },
  viewAllBtn: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#000",
    borderRadius: 20,
    alignItems: "center",
    alignSelf: "flex-end",
  },
  viewAllBtnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
