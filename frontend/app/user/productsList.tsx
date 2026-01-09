import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
} from "react-native";
import axios from "axios";
import ProductCard from "../productCard";
import Header from "../header";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useShop } from "../hooks/useShop";

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

export default function ProductsPage() {
  const router = useRouter();

  const { cart, favorites, orders, addToCart, addToFavorites } = useShop();

  const [products, setProducts] = useState<Product[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ordersModalVisible, setOrdersModalVisible] = useState(false);

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

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    AsyncStorage.getItem("role").then(setRole);
    axios.get(`${API_URL}/products`).then((r) => setProducts(r.data || []));
  }, []);

  const list = products
    .filter((p) => {
      if (!p.name.toLowerCase().includes(searchQuery.toLowerCase()))
        return false;
      if (filters.CATEGORY && p.category !== filters.CATEGORY) return false;
      if (filters.SUBCATEGORY && p.subcategory !== filters.SUBCATEGORY)
        return false;
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
        <Text style={{ fontWeight: "600" }}>
          {value ? `${label}: ${value}` : label}
        </Text>
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

    if (open === "SIZE") {
      return filters.CATEGORY === "Shoes" ? DATA.SIZE_SHOE : DATA.SIZE_CLOTH;
    }

    return DATA[open as keyof typeof DATA] ?? [];
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        title={
          <Text style={{ color: "#fff", fontSize: 20 }}>FashionStore</Text>
        }
        role={role}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartCount={cart.length}
        favoritesCount={favorites.length}
        ordersCount={orders.length}
        onMenuPress={() => setSidebarOpen(true)}
        onCartPress={() => setSidebarOpen(true)}
        onFavoritesPress={() => setSidebarOpen(true)}
        onOrdersPress={() => setOrdersModalVisible(true)}
      />

      <ScrollView>
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
          {/* {list.map(p => < key={p.id} product={p} />)} */}

          <View style={styles.grid}>
            {list.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                addToCart={addToCart}
                addToFavorites={addToFavorites}
              />
            ))}
          </View>
        </View>

 
      </ScrollView>
    </View>
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
