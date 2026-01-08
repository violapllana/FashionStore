import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

import AdminLayout from "./components/AdminLayout";

const API_URL = "http://localhost:5000/api/auth/profile";

export default function ProfileScreen() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [editModal, setEditModal] = useState(false);

  const [form, setForm] = useState({ name: "", email: "" });
  const [address, setAddress] = useState({
    addressLine: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    AsyncStorage.getItem("role").then((r) => setRole(r));
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        alert("Login first");
        return;
      }

      const res = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUser(res.data);
      setForm({ name: res.data.name, email: res.data.email });
      setAddress({
        addressLine: res.data.addressLine || "",
        city: res.data.city || "",
        postalCode: res.data.postalCode || "",
        phone: res.data.phone || "",
      });
    } catch (err) {
      console.log(err);
      alert("Cannot fetch profile");
    }
  };

  const saveProfileAndAddress = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const res = await axios.put(
        API_URL,
        {
          name: form.name || user.name,
          email: form.email || user.email,
          addressLine: address.addressLine || user.addressLine,
          city: address.city || user.city,
          postalCode: address.postalCode || user.postalCode,
          phone: address.phone || user.phone,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setUser(res.data.user);
      setEditModal(false);
      alert("Profile updated");
    } catch (err) {
      console.log(err);
      alert("Update failed");
    }
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
    router.push("/");
  };

  if (!user) return <Text style={{ color: "#000", margin: 20 }}>Loading...</Text>;

  return (
    <AdminLayout>
    <ScrollView style={styles.container}>
      

      {/* PROFILE CARD */}
      <View style={styles.formWrapper}>
        <Text style={styles.pageTitle}>My Profile</Text>
        <View style={styles.card}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{user.name}</Text>

          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>

          <Text style={styles.label}>Address Line</Text>
          <Text style={styles.value}>{user.addressLine || "-"}</Text>

          <Text style={styles.label}>City</Text>
          <Text style={styles.value}>{user.city || "-"}</Text>

          <Text style={styles.label}>Postal Code</Text>
          <Text style={styles.value}>{user.postalCode || "-"}</Text>

          <Text style={styles.label}>Phone</Text>
          <Text style={styles.value}>{user.phone || "-"}</Text>

          <Pressable
            style={styles.editBtn}
            onPress={() => setEditModal(true)}
          >
            <Text style={styles.btnText}>Edit Profile</Text>
          </Pressable>
        </View>
      </View>

      {/* EDIT MODAL */}
      <Modal visible={editModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              value={form.name}
              onChangeText={(t) => setForm({ ...form, name: t })}
              placeholder="Name"
            />
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(t) => setForm({ ...form, email: t })}
              placeholder="Email"
            />
            <TextInput
              style={styles.input}
              placeholder="Address Line"
              value={address.addressLine}
              onChangeText={(t) =>
                setAddress({ ...address, addressLine: t })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="City"
              value={address.city}
              onChangeText={(t) => setAddress({ ...address, city: t })}
            />
            <TextInput
              style={styles.input}
              placeholder="Postal Code"
              value={address.postalCode}
              onChangeText={(t) =>
                setAddress({ ...address, postalCode: t })
              }
            />
            <TextInput
              style={styles.input}
              placeholder="Phone"
              value={address.phone}
              onChangeText={(t) => setAddress({ ...address, phone: t })}
            />

            <Pressable style={styles.saveBtn} onPress={saveProfileAndAddress}>
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.saveBtn, { backgroundColor: "#888", marginTop: 10 }]}
              onPress={() => setEditModal(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>


    </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  logoutBtn: {
    backgroundColor: "#ff4d6d",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  formWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 15,
  },
  pageTitle: { fontSize: 28, fontWeight: "700", color: "#000", marginBottom: 20 },
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
  },
  label: { color: "#333", fontSize: 14, marginTop: 10, fontWeight: "600" },
  value: { color: "#000", fontSize: 16, marginBottom: 5 },
  editBtn: {
    backgroundColor: "#000",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f2f2f2",
    color: "#000",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#000",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
});
