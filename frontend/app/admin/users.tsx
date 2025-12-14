import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Modal } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useRouter } from 'expo-router';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface UserForm {
  name: string;
  email: string;
  role: 'admin' | 'user';
  password?: string;
}

export default function ManageUsers() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal state
  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState<UserForm>({ name: '', email: '', role: 'user', password: '' });
  const [editId, setEditId] = useState<number | null>(null);

  // Delete modal state
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    const checkAdmin = async () => {
      const role = await AsyncStorage.getItem('role');
      if (role !== 'admin') {
        router.replace('/'); // ridrejto user te home
      } else {
        fetchUsers();
      }
    };
    checkAdmin();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const openForm = (user?: User) => {
    if (user) {
      setForm({ name: user.name, email: user.email, role: user.role as 'admin' | 'user' });
      setEditId(user.id);
    } else {
      setForm({ name: '', email: '', role: 'user', password: '' });
      setEditId(null);
    }
    setModalVisible(true);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      if (editId) {
        await axios.put(`http://localhost:5000/api/auth/users/${editId}`, 
          { name: form.name, email: form.email, role: form.role },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else {
        await axios.post(`http://localhost:5000/api/auth/register`,
          form,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }

      setModalVisible(false);
      fetchUsers();
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // Open delete modal
  const confirmDelete = (id: number) => {
    setDeleteId(id);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/auth/users/${deleteId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeleteModalVisible(false);
      fetchUsers();
    } catch (err: any) {
      console.log(err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manage Users</Text>

      <Pressable style={styles.createBtn} onPress={() => openForm()}>
        <Text style={styles.createText}>Create New User/Admin</Text>
      </Pressable>

      <View style={styles.table}>
        <View style={[styles.row, styles.headerRow]}>
          <Text style={[styles.cell, styles.headerText]}>Name</Text>
          <Text style={[styles.cell, styles.headerText]}>Email</Text>
          <Text style={[styles.cell, styles.headerText]}>Role</Text>
          <Text style={[styles.cell, styles.headerText, styles.actionsCol]}>Actions</Text>
        </View>

        <ScrollView style={{ maxHeight: 400 }}>
          {loading ? (
            <Text style={{ padding: 20 }}>Loading...</Text>
          ) : users.length === 0 ? (
            <Text style={{ padding: 20 }}>No users found</Text>
          ) : (
            users.map(user => (
              <View key={user.id} style={styles.row}>
                <Text style={styles.cell}>{user.name}</Text>
                <Text style={styles.cell}>{user.email}</Text>
                <Text style={styles.cell}>{user.role}</Text>
                <View style={[styles.cell, styles.actionsCol]}>
                  <Pressable style={styles.editBtn} onPress={() => openForm(user)}>
                    <Text style={styles.btnText}>Edit</Text>
                  </Pressable>
                  <Pressable style={styles.deleteBtn} onPress={() => confirmDelete(user.id)}>
                    <Text style={styles.btnText}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      </View>

      {/* User form modal */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{editId ? 'Edit User' : 'Create User/Admin'}</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={form.name}
              onChangeText={text => setForm({ ...form, name: text })}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={text => setForm({ ...form, email: text })}
              keyboardType="email-address"
            />
            {!editId && (
              <TextInput
                style={styles.input}
                placeholder="Password"
                value={form.password}
                onChangeText={text => setForm({ ...form, password: text })}
                secureTextEntry
              />
            )}

            <Text style={{ marginBottom: 5, fontWeight: '600' }}>Role</Text>
            <View style={{ flexDirection: 'row', marginBottom: 15, gap: 10 }}>
              <Pressable
                style={[styles.roleBtn, form.role === 'user' && styles.selectedRole]}
                onPress={() => setForm({ ...form, role: 'user' })}
              >
                <Text>User</Text>
              </Pressable>
              <Pressable
                style={[styles.roleBtn, form.role === 'admin' && styles.selectedRole]}
                onPress={() => setForm({ ...form, role: 'admin' })}
              >
                <Text>Admin</Text>
              </Pressable>
            </View>

            <Pressable style={styles.btn} onPress={handleSubmit}>
              <Text style={styles.btnText}>{editId ? 'Update' : 'Create'}</Text>
            </Pressable>

            <Pressable style={[styles.btn, { backgroundColor: '#6c757d', marginTop: 10 }]} onPress={() => setModalVisible(false)}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Delete confirmation modal */}
      <Modal visible={deleteModalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure you want to delete this user?</Text>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
              <Pressable style={[styles.btn, { backgroundColor: '#dc3545', flex: 1, marginRight: 10 }]} onPress={handleDelete}>
                <Text style={styles.btnText}>Yes</Text>
              </Pressable>
              <Pressable style={[styles.btn, { backgroundColor: '#6c757d', flex: 1 }]} onPress={() => setDeleteModalVisible(false)}>
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
  container: { flex: 1, padding: 20, backgroundColor: '#f5f6f8' },
  title: { fontSize: 32, fontWeight: '700', color: '#1f4fd8', marginBottom: 20 },
  createBtn: { backgroundColor: '#28a745', paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8, alignSelf: 'flex-start', marginBottom: 25 },
  createText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  table: { backgroundColor: '#fff', borderRadius: 8, overflow: 'hidden', elevation: 2 },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#eee' },
  headerRow: { backgroundColor: '#343a40' },
  cell: { flex: 1, fontSize: 15 },
  headerText: { color: '#fff', fontWeight: '700', fontSize: 16 },
  actionsCol: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
  editBtn: { backgroundColor: '#0d6efd', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 6 },
  deleteBtn: { backgroundColor: '#dc3545', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 6 },
  btnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 20 },
  modalContent: { backgroundColor: '#fff', borderRadius: 8, padding: 20 },
  modalTitle: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  input: { backgroundColor: '#f0f0f0', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 8, marginBottom: 15 },
  btn: { backgroundColor: '#0d6efd', paddingVertical: 14, borderRadius: 8, alignItems: 'center' },
  roleBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#eee' },
  selectedRole: { backgroundColor: '#0d6efd', color: '#fff' },
});
