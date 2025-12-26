// Header.tsx
import React from "react";
import { View, Text, Pressable, TextInput, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

interface HeaderProps {
  title: string;
  role?: string | null;
  cart?: any[];
  favorites?: any[];
  orders?: any[];
  searchQuery?: string;
  setSearchQuery?: (query: string) => void;
  onMenuPress: () => void;
  onLogout?: () => void;
  onOrdersPress?: () => void;
}

export default function Header({
  title,
  role,
  cart = [],
  favorites = [],
  orders = [],
  searchQuery = "",
  setSearchQuery,
  onMenuPress,
  onLogout,
  onOrdersPress,
}: HeaderProps) {
  const router = useRouter();

  return (
    <View style={styles.topBar}>
      <Pressable onPress={onMenuPress}>
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>

      <Text style={styles.title}>{title}</Text>

      <View style={styles.searchContainer}>
        {setSearchQuery && (
          <TextInput
            placeholder="Search..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#ccc"
            style={styles.searchInput}
          />
        )}
      </View>

      <View style={styles.headerRight}>
        {role && (
          <>
            <Pressable onPress={onMenuPress} style={{ marginRight: 10 }}>
              <Text style={styles.iconText}>♥ ({favorites.length})</Text>
            </Pressable>
            <Pressable onPress={onMenuPress} style={{ marginRight: 10 }}>
              <Text style={styles.iconText}>🛒 ({cart.length})</Text>
            </Pressable>
            <Pressable onPress={onOrdersPress} style={{ marginRight: 10 }}>
              <Text style={styles.iconText}>📦 ({orders.length})</Text>
            </Pressable>
          </>
        )}

        {role ? (
          <Pressable
            style={styles.logoutBtn}
            onPress={() => {
              if (onLogout) onLogout();
              router.push("/"); // redirect në Home pas logout
            }}
          >
            <Text style={styles.btnText}>Logout</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              style={styles.loginBtn}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.btnText}>Login</Text>
            </Pressable>
            <Pressable
              style={styles.registerBtn}
              onPress={() => router.push("/register")}
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
  menuIcon: { color: "#fff", fontSize: 26 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold" },
  searchContainer: { flex: 1, marginHorizontal: 10 },
  searchInput: {
    height: 38,
    backgroundColor: "#222",
    borderRadius: 8,
    paddingHorizontal: 10,
    color: "#fff",
  },
  headerRight: { flexDirection: "row", alignItems: "center" },
  iconText: { color: "#fff", fontWeight: "700" },
  logoutBtn: {
    backgroundColor: "#e11d48",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  loginBtn: {
    backgroundColor: "#2563eb",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginRight: 5,
  },
  registerBtn: {
    backgroundColor: "#16a34a",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  btnText: { color: "#fff", fontWeight: "700" },
});
