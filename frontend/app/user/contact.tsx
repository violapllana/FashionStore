import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserLayout from "./components/UserLayout";


type StatusType = { type: "success" | "error"; text: string } | null;

export default function ContactPage() {
  const [role, setRole] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [status, setStatus] = useState<StatusType>(null);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    AsyncStorage.getItem("role").then(setRole);
  }, []);

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async () => {

    if (!name.trim() || !email.trim() || !message.trim()) {
      setStatus({
        type: "error",
        text: "Please fill in all fields before sending your message.",
      });
      return;
    }

    if (!isValidEmail(email)) {
      setStatus({
        type: "error",
        text: "The email address you entered is not valid. Please try again.",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (!res.ok) throw new Error("Network response not ok");

      setStatus({
        type: "success",
        text: "Your message has been sent successfully!",
      });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus({
        type: "error",
        text: "Oops! Something went wrong while sending your message. Please try again later.",
      });
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

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
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <Text style={styles.formHeader}>Contact Us</Text>

          {status && (
            <View
              style={[
                styles.status,
                { backgroundColor: status.type === "success" ? "#d4edda" : "#f8d7da" },
              ]}
            >
              <Text style={{ color: status.type === "success" ? "#155724" : "#721c24" }}>
                {status.text}
              </Text>
            </View>
          )}

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            style={[styles.input, { height: 120 }]}
            multiline
          />

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={[styles.sendBtn, { opacity: loading ? 0.6 : 1 }]}
          >
            <Text style={styles.btnText}>{loading ? "Sending..." : "Send Message"}</Text>
          </Pressable>
        </View>

  
      </ScrollView>
    </UserLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f0f2f5",
    padding: 20,
    alignItems: "center",
  },
  card: {
    width: "100%",
    maxWidth: 450,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 25,
    elevation: 5,
    marginTop: 40,
  },
  formHeader: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
  },
  status: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "500",
  },
  input: {
    backgroundColor: "#f2f2f2",
    padding: 14,
    borderRadius: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  sendBtn: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
