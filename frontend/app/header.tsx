
import { useEffect, useState } from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface HeaderProps {
  favoritesCount?: number;
  cartCount?: number;
  ordersCount?: number;
}

export default function Header({
  favoritesCount = 0,
  cartCount = 0,
  ordersCount = 0,
}: HeaderProps) {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    AsyncStorage.getItem("role").then((r) => setRole(r));
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
    router.push("/");
  };

  const handleMenu = () => {
    console.log("Menu clicked");
  };

  const handleFavorites = () => {
    console.log("Favorites clicked");
  };

  const handleCart = () => {
    console.log("Cart clicked");
  };

  const handleOrders = () => {
    console.log("Orders clicked");
  };

  return (
    <View style={styles.topBar}>
      <Pressable onPress={handleMenu}>
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/")}>
        <Text style={styles.title}>FashionStore</Text>
      </Pressable>

      <TextInput
        placeholder="Search..."
        style={styles.searchInput}
        placeholderTextColor="#ccc"
      />

      <View style={styles.headerRight}>
        {role && (
          <>
            <Pressable onPress={handleFavorites}>
              <Text style={styles.iconText}>♥ ({favoritesCount})</Text>
            </Pressable>
            <Pressable onPress={handleCart}>
              <Text style={styles.iconText}>🛒 ({cartCount})</Text>
            </Pressable>
            <Pressable onPress={handleOrders}>
              <Text style={styles.iconText}>📦 ({ordersCount})</Text>
            </Pressable>
          </>
        )}

        {role ? (
          <Pressable onPress={handleLogout} style={styles.logoutBtn}>
            <Text style={styles.btnText}>Logout</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={() => router.push("/login")}
              style={styles.loginBtn}
            >
              <Text style={styles.btnText}>Login</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/register")}
              style={styles.registerBtn}
            >
              <Text style={styles.btnText}>Register</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  menuIcon: { color: "#fff", fontSize: 28 },
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  searchInput: {
    backgroundColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 10,
    height: 35,
    fontSize: 14,
    color: "#fff",
  },
  iconText: { color: "#fff", marginHorizontal: 8 },
  loginBtn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
  },
  registerBtn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
  },
  logoutBtn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  btnText: { textAlign: "center", color: "#fff", fontSize: 14, fontWeight: "600" },
});
