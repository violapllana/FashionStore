import { View, ScrollView, Modal, Pressable, Text, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import ProductCard from "../productCard";
import { useShop } from "./components/useShop";
import UserLayout from "./components/UserLayout";
import { io } from "socket.io-client";
import Toast from "react-native-toast-message";


interface Product {
  id: number;
  name: string;
  description: string;
  image?: string;
  price: number;
  category?: string;
  subcategory?: string;
  gender?: string;
  sizes?: string[];
  colors?: string[];
}

const DATA = {
  CATEGORY: ["Clothing", "Shoes", "Accessories", "Bags"],
  SUBCATEGORY: ["Tops", "Jackets", "Pants", "Dresses"],
  GENDER: ["Men", "Women", "Kids"],
  SIZE_CLOTH: ["XS", "S", "M", "L", "XL", "XXL"],
  SIZE_SHOE: ["36", "37", "38", "39", "40", "41", "42", "43", "44", "45"],
  COLOR: ["Black", "White", "Red", "Blue", "Green"],
  PRICE: ["0-50", "50-100", "100-200", "200+"],
  SORT: ["Lowest price", "Highest price", "A-Z", "Z-A"],
};


const API_BASE = "http://localhost:5000";
const socket = io(API_BASE);

export default function ProductsPage() {
  const router = useRouter();
  const { cart, favorites, orders, addToCart, addToFavorites } = useShop();
  

  const [products, setProducts] = useState<Product[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<any>({
    CATEGORY: null,
    SUBCATEGORY: null,
    GENDER: null,
    COLOR: null,
    SIZE: null,
    PRICE: null,
    SORT: null,
  });
  const [open, setOpen] = useState<keyof typeof DATA | "SIZE" | null>(null);


const handleAddToCart = (product: Product) => {
  addToCart(product);
  Toast.show({
    type: "success",
    text1: "Added to Cart",
    text2: `${product.name} has been added to your cart.`,
    visibilityTime: 3000,
  });
};

const handleAddToFavorites = (product: Product) => {
  addToFavorites(product);
  Toast.show({
    type: "success",
    text1: "Added to Favorites",
    text2: `${product.name} has been added to your favorites.`,
    visibilityTime: 3000,
  });
};



  useEffect(() => {
    AsyncStorage.getItem("role").then(setRole);

    axios.get(`${API_BASE}/api/products`)
      .then((res) => {
        const now = new Date();
        const productsWithNewFlag = res.data.map((p: any) => {
          const createdAt = new Date(p.createdAt);
          const isNew = (now.getTime() - createdAt.getTime()) < 24 * 60 * 60 * 1000;
          return { ...p, isNew };
        });

        productsWithNewFlag.sort((a: any, b: any) => {
          if (a.isNew && !b.isNew) return -1;
          if (!a.isNew && b.isNew) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

        setProducts(productsWithNewFlag || []);
      })
      .catch((err) => console.log("Error fetching products:", err));


    socket.on("newProduct", (product: Product) => {
      Alert.alert("Produkt i ri!", `${product.name} - $${product.price}`);
      setProducts(prev => [{ ...product, isNew: true }, ...prev]);

      Toast.show({
        type: "success",
        text1: "Produkt i ri!",
        text2: `${product.name} - $${product.price}`,
        visibilityTime: 4000,
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const list = products
    .filter((p) => {
      if (!p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.CATEGORY && p.category !== filters.CATEGORY) return false;
      if (filters.SUBCATEGORY && p.subcategory !== filters.SUBCATEGORY) return false;
      if (filters.GENDER && p.gender !== filters.GENDER) return false;
      if (filters.COLOR && !p.colors?.includes(filters.COLOR)) return false;
      if (filters.SIZE && !p.sizes?.includes(filters.SIZE)) return false;
      if (filters.PRICE) {
        if (filters.PRICE === "200+" && p.price < 200) return false;
        if (filters.PRICE !== "200+") {
          const [min, max] = filters.PRICE.split("-").map(Number);
          if (p.price < min || p.price > max) return false;
        }
      }
      return true;
    })
    .sort((a, b) => {
      if (!filters.SORT) return 0;
      if (filters.SORT === "Lowest price") return a.price - b.price;
      if (filters.SORT === "Highest price") return b.price - a.price;
      if (filters.SORT === "A-Z") return a.name.localeCompare(b.name);
      return b.name.localeCompare(a.name);
    });

  const pill = (key: keyof typeof DATA | "SIZE", label: string) => {
    const value = filters[key];
    return (
      <Pressable
        style={[styles.pill, value && styles.pillActive]}
        onPress={() => setOpen(open === key ? null : key)}
      >
        <Text style={{ fontWeight: "600" }}>{value ? `${label}: ${value}` : label}</Text>
        {value && (
          <Pressable onPress={() => setFilters({ ...filters, [key]: null })}>
            <Text style={{ marginLeft: 6 }}>✕</Text>
          </Pressable>
        )}
      </Pressable>
    );
  };

  function getOptions() {
    if (!open) return [];
    if (open === "SIZE") return filters.CATEGORY === "Shoes" ? DATA.SIZE_SHOE : DATA.SIZE_CLOTH;
    return DATA[open as keyof typeof DATA] ?? [];
  }

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
  };

  return (
    <UserLayout
      role={role}
      cart={cart}
      favorites={favorites}
      orders={orders}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onLogout={handleLogout}
      onRemoveFavorite={() => {}}
      onChangeQty={() => {}}
      onOrder={() => {}}
    >
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={styles.bar}>
          {pill("CATEGORY", "Category")}
          {pill("SUBCATEGORY", "Subcategory")}
          {pill("GENDER", "Gender")}
          {pill("COLOR", "Color")}
          {pill("SIZE", "Size")}
          {pill("PRICE", "Price")}
          {pill("SORT", "Sort")}
        </View>

        <Modal transparent visible={!!open} animationType="fade">
          <Pressable style={styles.overlay} onPress={() => setOpen(null)}>
            <View style={styles.sheet}>
              {getOptions().map((item: string) => (
                <Pressable
                  key={item}
                  style={styles.option}
                  onPress={() => {
                    setFilters({ ...filters, [open as string]: item });
                    setOpen(null);
                  }}
                >
                  <Text>{item}</Text>
                </Pressable>
              ))}
            </View>
          </Pressable>
        </Modal>

        <Text style={styles.title}>All Products</Text>

   <View style={styles.grid}>
  {list.map((p) => (
    <ProductCard
      key={p.id}
      product={p}
      addToCart={() => handleAddToCart(p)}
      addToFavorites={() => handleAddToFavorites(p)}
    />
  ))}
</View>

      </ScrollView>
      <Toast position="top" />
    </UserLayout>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", margin: 20 },

  bar: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 12,
  },

  pill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
  },

  pillActive: {
    backgroundColor: "#e0e0e0",
  },

  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    justifyContent: "flex-start",
    paddingTop: 120,
  },

  sheet: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 14,
  },

  option: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
});
