import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  Modal,
  StyleSheet,
  Alert,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const API_URL = "http://localhost:5000/api";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  image?: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  sizes: string;
  colors: string;
}

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<ProductForm>({
    name: "",
    description: "",
    price: "",
    category: "",
    sizes: "",
    colors: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedImage, setSelectedImage] = useState<any>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const role = await AsyncStorage.getItem("role");
      if (role !== "admin") router.replace("/");
      else fetchProducts();
    };
    checkAdmin();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/products", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || res.data);
    } catch (err) {
      Alert.alert("Error", "Cannot fetch products");
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert(
        "Permission required",
        "Permission to access gallery is required!"
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.7,
    });

    if (!result.canceled) setSelectedImage(result.assets[0]);
  };

  const openForm = (product?: Product) => {
    if (product) {
      setForm({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        category: product.category,
        sizes: product.sizes?.join(",") || "",
        colors: product.colors?.join(",") || "",
      });
      setEditId(product.id);
      if (product.image) setSelectedImage({ uri: product.image });
      else setSelectedImage(null);
    } else {
      setForm({
        name: "",
        description: "",
        price: "",
        category: "",
        sizes: "",
        colors: "",
      });
      setEditId(null);
      setSelectedImage(null);
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      formData.append("category", form.category);
      formData.append(
        "sizes",
        JSON.stringify(
          form.sizes
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        )
      );

      formData.append(
        "colors",
        JSON.stringify(
          form.colors
            .split(",")
            .map((c) => c.trim())
            .filter(Boolean)
        )
      );

      if (selectedImage?.uri && !selectedImage.uri.startsWith("data:image")) {
        const uriParts = selectedImage.uri.split(".");
        const fileType = uriParts[uriParts.length - 1];
        formData.append("image", {
          uri: selectedImage.uri,
          name: `photo.${fileType}`,
          type: `image/${fileType}`,
        } as any);
      }

      if (editId) {
        await axios.put(
          `http://localhost:5000/api/products/${editId}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        await axios.post("http://localhost:5000/api/products", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      setModalVisible(false);
      setSelectedImage(null);
      fetchProducts();
    } catch (err) {
      Alert.alert("Error", "Could not save product");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/products/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteModalVisible(false);
      fetchProducts();
    } catch (err) {
      Alert.alert("Error", "Could not delete product");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Products</Text>
      <Pressable style={styles.createBtn} onPress={() => openForm()}>
        <Text style={styles.createText}>Add Product</Text>
      </Pressable>

      <ScrollView style={{ maxHeight: 400 }}>
        {loading ? (
          <Text style={{ padding: 20 }}>Loading...</Text>
        ) : products.length === 0 ? (
          <Text style={{ padding: 20 }}>No products found</Text>
        ) : (
          products.map((p) => (
            <View key={p.id} style={styles.row}>
              {p.image && (
                <Image
  source={{
    uri: p.image.startsWith("http")
      ? p.image
      : `${API_URL}/uploads/${p.image}`,
  }}
  style={{
    width: 50,
    height: 50,
    borderRadius: 8,
    marginRight: 10,
  }}
/>

              )}
              <Text style={styles.cell}>{p.name}</Text>
              <Text style={styles.cell}>{p.category}</Text>
              <Text style={styles.cell}>${p.price}</Text>
              <View style={[styles.cell, styles.actionsCol]}>
                <Pressable style={styles.editBtn} onPress={() => openForm(p)}>
                  <Text style={styles.btnText}>Edit</Text>
                </Pressable>
                <Pressable
                  style={styles.deleteBtn}
                  onPress={() => confirmDelete(p.id)}
                >
                  <Text style={styles.btnText}>Delete</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Form modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {editId ? "Edit Product" : "Add Product"}
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Name"
              value={form.name}
              onChangeText={(text) => setForm({ ...form, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Description"
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Price"
              value={form.price}
              keyboardType="numeric"
              onChangeText={(text) => setForm({ ...form, price: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Category"
              value={form.category}
              onChangeText={(text) => setForm({ ...form, category: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Sizes (comma separated)"
              value={form.sizes}
              onChangeText={(text) => setForm({ ...form, sizes: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Colors (comma separated)"
              value={form.colors}
              onChangeText={(text) => setForm({ ...form, colors: text })}
            />

            <Pressable
              style={[styles.btn, { marginBottom: 15 }]}
              onPress={pickImage}
            >
              <Text style={styles.btnText}>
                {selectedImage ? "Change Image" : "Select Image"}
              </Text>
            </Pressable>
            {selectedImage && (
              <Image
                source={{ uri: selectedImage.uri }}
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: 8,
                  marginBottom: 15,
                }}
              />
            )}

            <Pressable style={styles.btn} onPress={handleSubmit}>
              <Text style={styles.btnText}>{editId ? "Update" : "Add"}</Text>
            </Pressable>
            <Pressable
              style={[
                styles.btn,
                { backgroundColor: "#6c757d", marginTop: 10 },
              ]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Delete modal */}
      <Modal
        visible={deleteModalVisible}
        animationType="fade"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Are you sure you want to delete this product?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 20,
              }}
            >
              <Pressable
                style={[
                  styles.btn,
                  { backgroundColor: "#dc3545", flex: 1, marginRight: 10 },
                ]}
                onPress={handleDelete}
              >
                <Text style={styles.btnText}>Yes</Text>
              </Pressable>
              <Pressable
                style={[styles.btn, { backgroundColor: "#6c757d", flex: 1 }]}
                onPress={() => setDeleteModalVisible(false)}
              >
                <Text style={styles.btnText}>No</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#121212" },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#00d1b2",
    marginBottom: 20,
  },
  createBtn: {
    backgroundColor: "#00d1b2",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "flex-start",
    marginBottom: 25,
  },
  createText: { color: "#121212", fontSize: 16, fontWeight: "700" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  cell: { flex: 1, fontSize: 15, color: "#fff" },
  actionsCol: { flexDirection: "row", justifyContent: "flex-end", gap: 10 },
  editBtn: {
    backgroundColor: "#0066ff",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  deleteBtn: {
    backgroundColor: "#ff3860",
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  btnText: { color: "#fff", fontWeight: "700", textAlign: "center" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: { backgroundColor: "#1e1e1e", borderRadius: 12, padding: 20 },
  modalTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#00d1b2",
  },
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
