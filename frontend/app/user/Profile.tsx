import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth/profile";

export default function ProfileScreen() {
  const [user, setUser] = useState<any>(null);

  const [editModal, setEditModal] = useState(false);
  const [addressModal, setAddressModal] = useState(false);

  const [form, setForm] = useState({ name: "", email: "" });
  const [address, setAddress] = useState({
    addressLine: "",
    city: "",
    postalCode: "",
    phone: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  // 🔹 GET PROFILE
  const getProfile = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Alert.alert("Error", "Login first");
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
      Alert.alert("Error", "Cannot fetch profile");
    }
  };

  // 🔹 SAVE PROFILE & ADDRESS
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setUser(res.data.user);
      setEditModal(false);
      setAddressModal(false);
      Alert.alert("Success", "Profile updated");
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Update failed");
    }
  };

  if (!user)
    return <Text style={{ color: "#fff", margin: 20 }}>Loading...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Role</Text>
        <Text style={styles.value}>{user.role}</Text>

        {/* ✅ SHOW ADDRESS */}
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

        <Pressable
          style={[styles.editBtn, { marginTop: 10 }]}
          onPress={() => setAddressModal(true)}
        >
          <Text style={styles.btnText}>Edit Address</Text>
        </Pressable>
      </View>

      {/* EDIT PROFILE MODAL */}
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

            <Pressable style={styles.btn} onPress={saveProfileAndAddress}>
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: "#888", marginTop: 10 }]}
              onPress={() => setEditModal(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ADDRESS MODAL */}
      <Modal visible={addressModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Address</Text>

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

            <Pressable style={styles.btn} onPress={saveProfileAndAddress}>
              <Text style={styles.btnText}>Save Address</Text>
            </Pressable>
            <Pressable
              style={[styles.btn, { backgroundColor: "#888", marginTop: 10 }]}
              onPress={() => setAddressModal(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 20 },
  title: { fontSize: 32, fontWeight: "700", color: "#00d1b2", marginBottom: 20 },
  card: { backgroundColor: "#1e1e1e", borderRadius: 12, padding: 20 },
  label: { color: "#888", fontSize: 14, marginTop: 10 },
  value: { color: "#fff", fontSize: 16, marginBottom: 5 },
  editBtn: {
    backgroundColor: "#00d1b2",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#1e1e1e", borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: "700", marginBottom: 20, color: "#00d1b2" },
  input: {
    backgroundColor: "#272727",
    color: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    marginBottom: 15,
  },
  btn: {
    backgroundColor: "#00d1b2",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
});
