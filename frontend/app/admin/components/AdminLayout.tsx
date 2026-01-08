import { View, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopBar from "./AdminTopBar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const token = await AsyncStorage.getItem("token");
    if (!token) return;

    const res = await axios.get("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setUser(res.data);
  };

  if (!user) return null; // ose loader

  return (
    <View style={styles.container}>
      <AdminSidebar />

      <View style={styles.main}>
        {/* 🔥 KËTU SHFAQET HELLO + EMRI */}
        <AdminTopBar name={user.name} email={user.email} />

        <ScrollView style={styles.content}>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, flexDirection: "row" },
  main: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f7fb",
  },
  content: { flex: 1 },
});
