import { View, Text, TextInput, Pressable, StyleSheet, Alert, Modal } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function ProfileScreen() {
  const [user, setUser] = useState<{id:number,name:string,email:string,role:string}|null>(null);
  const [loading, setLoading] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [form, setForm] = useState({ name:'', email:'' });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
    if (!token) {
  Alert.alert('Error', 'Please login first');
  setLoading(false); // <--- shto
  return;
}


      const res = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setUser(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert('Error', 'Cannot fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const openEdit = () => {
    if (user) {
      setForm({ name: user.name, email: user.email });
      setModalVisible(true);
    }
  };
const handleUpdate = async () => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) return;

    const res = await axios.put('http://localhost:5000/api/auth/profile', form, {
      headers: { Authorization: `Bearer ${token}` }
    });

    setUser(res.data.user); // nga backend, res.json({ message, user })
    setModalVisible(false);
    Alert.alert('Success', 'Profile updated');
  } catch (err) {
    console.log(err);
    Alert.alert('Error', 'Cannot update profile');
  }
};


  if (!user) return <Text style={{color:'#fff', margin:20}}>Loading...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Profile</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user.name}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user.email}</Text>

        <Text style={styles.label}>Role:</Text>
        <Text style={styles.value}>{user.role}</Text>

        <Pressable style={styles.editBtn} onPress={openEdit}>
          <Text style={styles.btnText}>Edit Profile</Text>
        </Pressable>
      </View>

      {/* Modal for editing */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Profile</Text>

            <TextInput
              style={styles.input}
              placeholder="Name"
              value={form.name}
              onChangeText={text => setForm({...form, name:text})}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={form.email}
              onChangeText={text => setForm({...form, email:text})}
              keyboardType="email-address"
            />

            <Pressable style={styles.btn} onPress={handleUpdate}>
              <Text style={styles.btnText}>Save</Text>
            </Pressable>
            <Pressable style={[styles.btn, { backgroundColor:'#6c757d', marginTop:10 }]} onPress={()=>setModalVisible(false)}>
              <Text style={styles.btnText}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor:'#121212', padding:20 },
  title: { fontSize:32, fontWeight:'700', color:'#00d1b2', marginBottom:20 },
  card: { backgroundColor:'#1e1e1e', borderRadius:12, padding:20 },
  label: { color:'#888', fontSize:14, marginTop:10 },
  value: { color:'#fff', fontSize:16, marginBottom:5 },
  editBtn: { backgroundColor:'#00d1b2', paddingVertical:14, borderRadius:10, marginTop:20, alignItems:'center' },
  btnText: { color:'#fff', fontWeight:'700', textAlign:'center' },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.8)', justifyContent:'center', padding:20 },
  modalContent: { backgroundColor:'#1e1e1e', borderRadius:12, padding:20 },
  modalTitle: { fontSize:24, fontWeight:'700', marginBottom:20, color:'#00d1b2' },
  input: { backgroundColor:'#272727', color:'#fff', paddingVertical:12, paddingHorizontal:16, borderRadius:10, marginBottom:15 },
  btn: { backgroundColor:'#00d1b2', paddingVertical:14, borderRadius:10, alignItems:'center' }
});
