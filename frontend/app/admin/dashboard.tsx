import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./components/AdminSidebar";
import AdminTopBar from "./components/AdminTopBar";
import StatCard from "./components/StatCard";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const token = await AsyncStorage.getItem("token");

    const statsRes = await axios.get(
      "http://localhost:5000/api/admin/dashboard/stats",
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const userRes = await axios.get("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });

    setStats(statsRes.data);
    setUser(userRes.data);
  };

  if (!stats || !user) return null;

  return (
    <View style={styles.container}>
      <AdminSidebar />

      <View style={styles.main}>
        <AdminTopBar name={user.name} email={user.email} />

        <ScrollView>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Customers"
              value={stats.totalUsers}
              color="#6c63ff"
            />
            <StatCard
              title="Total Orders"
              value={stats.totalOrders}
              color="#ff6b6b"
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              title="Contacts"
              value={stats.totalContacts}
              color="#ffb703"
            />
            <StatCard
              title="Favorites"
              value={stats.totalFavorites}
              color="#2ecc71"
            />
          </View>
          <View style={styles.statsRow}>
            <StatCard
              title="Total Products"
              value={stats.totalProducts}
              color="#ea2121ff"
            />
            <StatCard
              title="Cart Items"
              value={stats.totalCart}
              color="#ed2dd0ff"
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f7fb", // background si ne foto
  },

  main: {
    flex: 1,
    padding: 20,
  },

  statsRow: {
    flexDirection: "row",
    gap: 15,
    marginBottom: 15,
  },

  chartBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginTop: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },

  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111",
    marginBottom: 6,
  },

  chartSub: {
    fontSize: 14,
    color: "#777",
  },
});
