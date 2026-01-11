import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "expo-router";
import UserLayout from "./user/components/UserLayout";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ResetPassword() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [role, setRole] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const t = params.get("token");
    if (t) setToken(t);
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
  };

  const handleReset = async () => {
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill all fields");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/reset-password", {
        token,
        password
      });
      setSuccess("Password changed successfully!");
      setTimeout(() => router.replace("/login"), 2000);
    } catch (err) {
      setError("Failed to reset password");
    }
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
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>

          <TextInput
            placeholder="New Password"
            placeholderTextColor="#777"
            style={styles.input}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#777"
            style={styles.input}
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}
          {success ? <Text style={styles.success}>{success}</Text> : null}

          <Pressable style={styles.button} onPress={handleReset}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </Pressable>
        </View>
      </View>
    </UserLayout>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#000", padding: 20 },
  card: { width: "100%", maxWidth: 380, backgroundColor: "#0f0f0f", borderRadius: 16, padding: 24 },
  title: { color: "#fff", fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { backgroundColor: "#111", color: "#fff", borderRadius: 10, padding: 10, marginBottom: 12 },
  button: { backgroundColor: "#fff", paddingVertical: 12, borderRadius: 10, marginTop: 10 },
  buttonText: { color: "#000", fontWeight: "600", textAlign: "center" },
  error: { color: "#ff4d4d", textAlign: "center", marginVertical: 8 },
  success: { color: "#4dff4d", textAlign: "center", marginVertical: 8 }
});
