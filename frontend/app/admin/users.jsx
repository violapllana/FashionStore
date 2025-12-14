import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, Alert, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function Users() {
  const router = useRouter();
const [users, setUsers] = useState([]);
const [token, setToken] = useState(null);
const [editingUser, setEditingUser] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    // Merr token nga AsyncStorage
    AsyncStorage.getItem('token').then(t => setToken(t));
  }, []);

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to fetch users');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Deleted', 'User deleted successfully');
      fetchUsers();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setRole(user.role);
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    try {
      await axios.put(`http://localhost:5000/api/users/${editingUser.id}`, 
        { name, email, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Updated', 'User updated successfully');
      setEditingUser(null);
      setName('');
      setEmail('');
      setRole('');
      fetchUsers();
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Failed to update user');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Admin Dashboard</Text>

      {editingUser && (
        <View style={styles.editCard}>
          <Text style={styles.editTitle}>Edit User</Text>
          <TextInput
            style={styles.input}
            placeholder="Name"
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={styles.input}
            placeholder="Role"
            value={role}
            onChangeText={setRole}
          />
          <Pressable style={styles.button} onPress={handleUpdate}>
            <Text style={styles.buttonText}>Update</Text>
          </Pressable>
        </View>
      )}

      {users.map(user => (
        <View key={user.id} style={styles.userCard}>
          <Text style={styles.userText}>{user.name} ({user.role})</Text>
          <View style={styles.buttons}>
            <Pressable style={styles.editBtn} onPress={() => handleEdit(user)}>
              <Text style={styles.btnText}>Edit</Text>
            </Pressable>
            <Pressable style={styles.deleteBtn} onPress={() => handleDelete(user.id)}>
              <Text style={styles.btnText}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: '700', marginBottom: 20 },
  userCard: { padding: 15, backgroundColor: '#f0f0f0', borderRadius: 12, marginBottom: 10 },
  userText: { fontSize: 16, marginBottom: 10 },
  buttons: { flexDirection: 'row' },
  editBtn: { marginRight: 10, backgroundColor: '#4caf50', padding: 8, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#f44336', padding: 8, borderRadius: 8 },
  btnText: { color: '#fff', fontWeight: '600' },
  editCard: { padding: 15, backgroundColor: '#e0e0e0', borderRadius: 12, marginBottom: 20 },
  editTitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  input: { backgroundColor: '#fff', padding: 10, borderRadius: 10, marginBottom: 10 },
  button: { backgroundColor: '#2196f3', padding: 12, borderRadius: 10 },
  buttonText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
});
