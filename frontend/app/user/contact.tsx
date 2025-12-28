import { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Footer from "../footer";

type StatusType = { type: "success" | "error"; text: string } | null;

export default function ContactPage() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<StatusType>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("role").then((r) => setRole(r));
  }, []);

  const handleSubmit = async () => {
    if (!role) {
      alert("You must be logged in to send a message.");
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

      setStatus({ type: "success", text: "Message sent successfully!" });
      setName("");
      setEmail("");
      setMessage("");
    } catch (err) {
      setStatus({ type: "error", text: "Error sending message. Try again." });
      console.error(err);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(null), 5000);
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
    router.push("/");
  };

  return (
    <View style={{ flex: 1 }}>
      {/* HEADER */}
      <View style={styles.topBar}>
        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.title}>FashionStore</Text>
        </Pressable>
        <View style={styles.headerRight}>
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

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          {/* Titulli lart brenda kartës */}
          <Text style={styles.formHeader}>Contact Us</Text>

          {status && (
            <View
              style={{
                ...styles.status,
                backgroundColor:
                  status.type === "success" ? "#d4edda" : "#f8d7da",
              }}
            >
              <Text
                style={{
                  color: status.type === "success" ? "#155724" : "#721c24",
                }}
              >
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
          />
          <TextInput
            placeholder="Message"
            value={message}
            onChangeText={setMessage}
            style={{ ...styles.input, height: 100 }}
            multiline
          />

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={{ ...styles.sendBtn, opacity: loading ? 0.6 : 1 }}
          >
            <Text style={styles.btnText}>{loading ? "Sending..." : "Send Message"}</Text>
          </Pressable>
        </View>

        <Footer />
      </ScrollView>
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
  title: { color: "#fff", fontSize: 20, fontWeight: "700" },
  headerRight: { flexDirection: "row", alignItems: "center" },
  loginBtn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginRight: 8,
  },
  registerBtn: {
    backgroundColor: "#ff4d6d",
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
  btnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    marginTop: 40,
  },
  formHeader: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
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
    color: "#000",
    paddingVertical: 14,
    paddingHorizontal: 16,
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
});
