import { View, Text, TextInput, Pressable, ScrollView, Modal, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  sizes: string[];
  colors: string[];
  imageUrl: string;
}

interface ProductForm {
  name: string;
  description: string;
  price: string;
  category: string;
  sizes: string;
  colors: string;
  imageUrl: string;
}

export default function ManageProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<ProductForm>({ name:'', description:'', price:'', category:'', sizes:'', colors:'', imageUrl:'' });
  const [editId, setEditId] = useState<number | null>(null);

  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const role = await AsyncStorage.getItem('role');
      if (role !== 'admin') {
        router.replace('/'); // ridrejton user te home
      } else {
        fetchProducts();
      }
    };
    checkAdmin();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(res.data.products || res.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Cannot fetch products');
    } finally {
      setLoading(false);
    }
  };

const openForm = (product?: Product) => {
  if (product) {
    setForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      sizes: Array.isArray(product.sizes) ? product.sizes.join(',') : (product.sizes || ''),
      colors: Array.isArray(product.colors) ? product.colors.join(',') : (product.colors || ''),
      imageUrl: product.imageUrl
    });
    setEditId(product.id);
  } else {
    setForm({ name:'', description:'', price:'', category:'', sizes:'', colors:'', imageUrl:'' });
    setEditId(null);
  }
  setModalVisible(true);
};


  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const body = {
        name: form.name,
        description: form.description,
        price: parseFloat(form.price),
        category: form.category,
        sizes: form.sizes.split(',').map(s => s.trim()).filter(s => s),
        colors: form.colors.split(',').map(c => c.trim()).filter(c => c),
        imageUrl: form.imageUrl
      };

      if (editId) {
        await axios.put(`http://localhost:5000/api/products/${editId}`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post(`http://localhost:5000/api/products`, body, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      setModalVisible(false);
      fetchProducts();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not save product');
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
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteModalVisible(false);
      fetchProducts();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Could not delete product');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Products</Text>

      <Pressable style={styles.createBtn} onPress={() => openForm()}>
        <Text style={styles.createText}>Add Product</Text>
      </Pressable>

      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerText]}>Name</Text>
          <Text style={[styles.cell, styles.headerText]}>Category</Text>
          <Text style={[styles.cell, styles.headerText]}>Price</Text>
          <Text style={[styles.cell, styles.headerText, styles.actionsCol]}>Actions</Text>
        </View>

        <ScrollView style={{ maxHeight: 400 }}>
          {loading ? (
            <Text style={{ padding:20 }}>Loading...</Text>
          ) : products.length === 0 ? (
            <Text style={{ padding:20 }}>No products found</Text>
          ) : (
            products.map(p => (
              <View key={p.id} style={styles.row}>
                <Text style={styles.cell}>{p.name}</Text>
                <Text style={styles.cell}>{p.category}</Text>
                <Text style={styles.cell}>${p.price}</Text>
                <View style={[styles.cell, styles.actionsCol]}>
                  <Pressable style={styles.editBtn} onPress={() => openForm(p)}>
                    <Text style={styles.btnText}>Edit</Text>
                  </Pressable>
                  <Pressable style={styles.deleteBtn} onPress={() => confirmDelete(p.id)}>
                    <Text style={styles.btnText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* Form modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId ? 'Edit Product' : 'Add Product'}</Text>

            <TextInput style={styles.input} placeholder="Name" value={form.name} onChangeText={text => setForm({...form, name:text})} />
            <TextInput style={styles.input} placeholder="Description" value={form.description} onChangeText={text => setForm({...form, description:text})} />
            <TextInput style={styles.input} placeholder="Price" value={form.price} keyboardType="numeric" onChangeText={text => setForm({...form, price:text})} />
            <TextInput style={styles.input} placeholder="Category" value={form.category} onChangeText={text => setForm({...form, category:text})} />
            <TextInput style={styles.input} placeholder="Sizes (comma separated)" value={form.sizes} onChangeText={text => setForm({...form, sizes:text})} />
            <TextInput style={styles.input} placeholder="Colors (comma separated)" value={form.colors} onChangeText={text => setForm({...form, colors:text})} />
            <TextInput style={styles.input} placeholder="Image URL" value={form.imageUrl} onChangeText={text => setForm({...form, imageUrl:text})} />

            <Pressable style={styles.btn} onPress={handleSubmit}>
              <Text style={styles.btnText}>{editId ? 'Update' : 'Add'}</Text>
            </Pressable>
            <Pressable style={[styles.btn, { backgroundColor:'#6c757d', marginTop:10 }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Delete modal */}
      <Modal visible={deleteModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure you want to delete this product?</Text>
            <View style={{ flexDirection:'row', justifyContent:'space-between', marginTop:20 }}>
              <Pressable style={[styles.btn, { backgroundColor:'#dc3545', flex:1, marginRight:10 }]} onPress={handleDelete}>
                <Text style={styles.btnText}>Yes</Text>
              </Pressable>
              <Pressable style={[styles.btn, { backgroundColor:'#6c757d', flex:1 }]} onPress={() => setDeleteModalVisible(false)}>
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
  container: { flex: 1, padding: 20, backgroundColor: '#121212' },
  title: { fontSize: 32, fontWeight: '700', color: '#00d1b2', marginBottom: 20 },
  createBtn: { 
    backgroundColor: '#00d1b2', 
    paddingVertical: 14, 
    paddingHorizontal: 20, 
    borderRadius: 10, 
    alignSelf: 'flex-start', 
    marginBottom: 25,
    shadowColor: '#00d1b2',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
    elevation: 4
  },
  createText: { color: '#121212', fontSize: 16, fontWeight: '700' },
  table: { 
    backgroundColor: '#1e1e1e', 
    borderRadius: 12, 
    overflow: 'hidden', 
    elevation: 2 
  },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  headerRow: { backgroundColor: '#272727' },
  cell: { flex: 1, fontSize: 15, color: '#fff' },
  headerText: { color: '#00d1b2', fontWeight: '700', fontSize: 16 },
  actionsCol: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  editBtn: { backgroundColor: '#0066ff', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#ff3860', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#00d1b2' },
  input: { backgroundColor: '#272727', color: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 15 },
  btn: { backgroundColor: '#00d1b2', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
  roleBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#333', color:'#fff' },
  selectedRole: { backgroundColor: '#00d1b2', color: '#121212' },
});
