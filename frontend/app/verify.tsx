import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Pressable
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import axios from "axios";
import UserLayout from "./user/components/UserLayout"; // ✅ add UserLayout
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function VerifyEmail() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const [role, setRole] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!token) {
      setMessage("Missing verification token");
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/verify?token=${token}`
        );
        setMessage(res.data.message);
        setSuccess(true);
      } catch (err: any) {
        setMessage(
          err.response?.data?.message || "Verification failed or expired"
        );
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

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
      <View style={styles.screen}>
        <View style={styles.card}>
          {loading ? (
            <ActivityIndicator size="large" color="#fff" />
          ) : (
            <>
              <Text style={styles.title}>
                {success ? "Email Verified 🎉" : "Verification Failed"}
              </Text>

              <Text style={styles.message}>{message}</Text>

              <Pressable
                style={styles.button}
                onPress={() => router.replace("/login")}
              >
                <Text style={styles.buttonText}>Go to Login</Text>
              </Pressable>
            </>
          )}
        </View>
      </View>
    </UserLayout>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#000" },
  card: { width: "100%", maxWidth: 380, backgroundColor: "#0f0f0f", borderRadius: 16, padding: 24, alignItems: "center" },
  title: { color: "#fff", fontSize: 20, fontWeight: "600", marginBottom: 12 },
  message: { color: "#aaa", fontSize: 14, textAlign: "center", marginBottom: 24 },
  button: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 32, borderRadius: 10 },
  buttonText: { color: "#000", fontWeight: "600" }
});
