// import { View, Text, ScrollView, Pressable, StyleSheet, TextInput, Modal } from 'react-native';
// import { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';
// import { useRouter } from 'expo-router';

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
//   addressLine?: string;
//   city?: string;
//   postalCode?: string;
//   phone?: string;
// }

// interface UserForm {
//   name: string;
//   email: string;
//   role: 'admin' | 'user';
//   password?: string;
//   addressLine?: string;
//   city?: string;
//   postalCode?: string;
//   phone?: string;
// }

// export default function ManageUsers() {
//   const router = useRouter();
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(false);

//   // Modal state for create/edit
//   const [modalVisible, setModalVisible] = useState(false);
//   const [form, setForm] = useState<UserForm>({ name: '', email: '', role: 'user', password: '' });
//   const [editId, setEditId] = useState<number | null>(null);

//   // Modal for delete
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const [deleteId, setDeleteId] = useState<number | null>(null);

//   // Modal for details
//   const [detailsModalVisible, setDetailsModalVisible] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);

//   useEffect(() => {
//     const checkAdmin = async () => {
//       const role = await AsyncStorage.getItem('role');
//       if (role !== 'admin') {
//         router.replace('/'); // ridrejto user te home
//       } else {
//         fetchUsers();
//       }
//     };
//     checkAdmin();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');
//       const res = await axios.get('http://localhost:5000/api/auth/users', {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data);
//     } catch (err: any) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openForm = (user?: User) => {
//     if (user) {
//       setForm({
//         name: user.name,
//         email: user.email,
//         role: user.role as 'admin' | 'user',
//         addressLine: user.addressLine || '',
//         city: user.city || '',
//         postalCode: user.postalCode || '',
//         phone: user.phone || '',
//       });
//       setEditId(user.id);
//     } else {
//       setForm({ name: '', email: '', role: 'user', password: '', addressLine:'', city:'', postalCode:'', phone:'' });
//       setEditId(null);
//     }
//     setModalVisible(true);
//   };

//   const handleSubmit = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');

//       if (editId) {
//         await axios.put(`http://localhost:5000/api/auth/users/${editId}`, 
//           form,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       } else {
//         await axios.post(`http://localhost:5000/api/auth/register`,
//           form,
//           { headers: { Authorization: `Bearer ${token}` } }
//         );
//       }

//       setModalVisible(false);
//       fetchUsers();
//     } catch (err: any) {
//       console.log(err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const confirmDelete = (id: number) => {
//     setDeleteId(id);
//     setDeleteModalVisible(true);
//   };

//   const handleDelete = async () => {
//     if (!deleteId) return;
//     try {
//       const token = await AsyncStorage.getItem('token');
//       await axios.delete(`http://localhost:5000/api/auth/users/${deleteId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDeleteModalVisible(false);
//       fetchUsers();
//     } catch (err: any) {
//       console.log(err);
//     }
//   };

//   const openDetails = (user: User) => {
//     setSelectedUser(user);
//     setDetailsModalVisible(true);
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage Users</Text>

//       <Pressable style={styles.createBtn} onPress={() => openForm()}>
//         <Text style={styles.createText}>Create New User/Admin</Text>
//       </Pressable>

//       <View style={styles.table}>
//         <View style={[styles.row, styles.headerRow]}>
//           <Text style={[styles.cell, styles.headerText]}>Name</Text>
//           <Text style={[styles.cell, styles.headerText]}>Email</Text>
//           <Text style={[styles.cell, styles.headerText]}>Role</Text>
//           <Text style={[styles.cell, styles.headerText, styles.actionsCol]}>Actions</Text>
//         </View>

//         <ScrollView style={{ maxHeight: 400 }}>
//           {loading ? (
//             <Text style={{ padding: 20 }}>Loading...</Text>
//           ) : users.length === 0 ? (
//             <Text style={{ padding: 20 }}>No users found</Text>
//           ) : (
//             users.map(user => (
//               <View key={user.id} style={styles.row}>
//                 <Text style={styles.cell}>{user.name}</Text>
//                 <Text style={styles.cell}>{user.email}</Text>
//                 <Text style={styles.cell}>{user.role}</Text>
//                 <View style={[styles.cell, styles.actionsCol]}>
//                   <Pressable style={styles.detailsBtn} onPress={() => openDetails(user)}>
//                     <Text style={styles.btnText}>Details</Text>
//                   </Pressable>
//                   <Pressable style={styles.editBtn} onPress={() => openForm(user)}>
//                     <Text style={styles.btnText}>Edit</Text>
//                   </Pressable>
//                   <Pressable style={styles.deleteBtn} onPress={() => confirmDelete(user.id)}>
//                     <Text style={styles.btnText}>Delete</Text>
//                   </Pressable>
//                 </View>
//               </View>
//             ))
//           )}
//         </ScrollView>
//       </View>

//       {/* User form modal */}
//       <Modal visible={modalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>{editId ? 'Edit User' : 'Create User/Admin'}</Text>

//             <TextInput
//               style={styles.input}
//               placeholder="Name"
//               value={form.name}
//               onChangeText={text => setForm({ ...form, name: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Email"
//               value={form.email}
//               onChangeText={text => setForm({ ...form, email: text })}
//               keyboardType="email-address"
//             />
//             {!editId && (
//               <TextInput
//                 style={styles.input}
//                 placeholder="Password"
//                 value={form.password}
//                 onChangeText={text => setForm({ ...form, password: text })}
//                 secureTextEntry
//               />
//             )}

//             <Text style={{ marginBottom: 5, fontWeight: '600' }}>Role</Text>
//             <View style={{ flexDirection: 'row', marginBottom: 15, gap: 10 }}>
//               <Pressable
//                 style={[styles.roleBtn, form.role === 'user' && styles.selectedRole]}
//                 onPress={() => setForm({ ...form, role: 'user' })}
//               >
//                 <Text>User</Text>
//               </Pressable>
//               <Pressable
//                 style={[styles.roleBtn, form.role === 'admin' && styles.selectedRole]}
//                 onPress={() => setForm({ ...form, role: 'admin' })}
//               >
//                 <Text>Admin</Text>
//               </Pressable>
//             </View>

//             {/* Address fields */}
//             <TextInput
//               style={styles.input}
//               placeholder="Address Line"
//               value={form.addressLine}
//               onChangeText={text => setForm({ ...form, addressLine: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="City"
//               value={form.city}
//               onChangeText={text => setForm({ ...form, city: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Postal Code"
//               value={form.postalCode}
//               onChangeText={text => setForm({ ...form, postalCode: text })}
//             />
//             <TextInput
//               style={styles.input}
//               placeholder="Phone"
//               value={form.phone}
//               onChangeText={text => setForm({ ...form, phone: text })}
//             />

//             <Pressable style={styles.btn} onPress={handleSubmit}>
//               <Text style={styles.btnText}>{editId ? 'Update' : 'Create'}</Text>
//             </Pressable>

//             <Pressable style={[styles.btn, { backgroundColor: '#6c757d', marginTop: 10 }]} onPress={() => setModalVisible(false)}>
//               <Text style={styles.btnText}>Cancel</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>

//       {/* Delete confirmation modal */}
//       <Modal visible={deleteModalVisible} animationType="fade" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Are you sure you want to delete this user?</Text>

//             <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
//               <Pressable style={[styles.btn, { backgroundColor: '#dc3545', flex: 1, marginRight: 10 }]} onPress={handleDelete}>
//                 <Text style={styles.btnText}>Yes</Text>
//               </Pressable>
//               <Pressable style={[styles.btn, { backgroundColor: '#6c757d', flex: 1 }]} onPress={() => setDeleteModalVisible(false)}>
//                 <Text style={styles.btnText}>No</Text>
//               </Pressable>
//             </View>
//           </View>
//         </View>
//       </Modal>

//       {/* Details modal */}
//       <Modal visible={detailsModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>User Details</Text>
//             {selectedUser && (
//               <>
//                 <Text style={styles.detailText}><Text style={{fontWeight:'700'}}>Name:</Text> {selectedUser.name}</Text>
//                 <Text style={styles.detailText}><Text style={{fontWeight:'700'}}>Email:</Text> {selectedUser.email}</Text>
//                 <Text style={styles.detailText}><Text style={{fontWeight:'700'}}>Role:</Text> {selectedUser.role}</Text>
//                 <Text style={styles.detailText}><Text style={{fontWeight:'700'}}>Address Line:</Text> {selectedUser.addressLine || '-'}</Text>
//                 <Text style={styles.detailText}><Text style={{fontWeight:'700'}}>City:</Text> {selectedUser.city || '-'}</Text>
//                 <Text style={styles.detailText}><Text style={{fontWeight:'700'}}>Postal Code:</Text> {selectedUser.postalCode || '-'}</Text>
//                 <Text style={styles.detailText}><Text style={{fontWeight:'700'}}>Phone:</Text> {selectedUser.phone || '-'}</Text>
//               </>
//             )}
//             <Pressable style={[styles.btn, { marginTop: 20 }]} onPress={() => setDetailsModalVisible(false)}>
//               <Text style={styles.btnText}>Close</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, padding: 20, backgroundColor: '#121212' },
//   title: { fontSize: 32, fontWeight: '700', color: '#00d1b2', marginBottom: 20 },
//   createBtn: { 
//     backgroundColor: '#00d1b2', 
//     paddingVertical: 14, 
//     paddingHorizontal: 20, 
//     borderRadius: 10, 
//     alignSelf: 'flex-start', 
//     marginBottom: 25,
//     shadowColor: '#00d1b2',
//     shadowOpacity: 0.5,
//     shadowOffset: { width: 0, height: 4 },
//     shadowRadius: 8,
//     elevation: 4
//   },
//   createText: { color: '#121212', fontSize: 16, fontWeight: '700' },
//   table: { 
//     backgroundColor: '#1e1e1e', 
//     borderRadius: 12, 
//     overflow: 'hidden', 
//     elevation: 2 
//   },
//   row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
//   headerRow: { backgroundColor: '#272727' },
//   cell: { flex: 1, fontSize: 15, color: '#fff' },
//   headerText: { color: '#00d1b2', fontWeight: '700', fontSize: 16 },
//   actionsCol: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },
//   editBtn: { backgroundColor: '#0066ff', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8 },
//   deleteBtn: { backgroundColor: '#ff3860', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8 },
//   detailsBtn: { backgroundColor: '#00d1b2', paddingVertical: 8, paddingHorizontal: 18, borderRadius: 8, marginRight: 5 },
//   btnText: { color: '#fff', fontWeight: '700', textAlign: 'center' },
//   modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', padding: 20 },
//   modalContent: { backgroundColor: '#1e1e1e', borderRadius: 12, padding: 20 },
//   modalTitle: { fontSize: 24, fontWeight: '700', marginBottom: 20, color: '#00d1b2' },
//   input: { backgroundColor: '#272727', color: '#fff', paddingVertical: 12, paddingHorizontal: 16, borderRadius: 10, marginBottom: 15 },
//   btn: { backgroundColor: '#00d1b2', paddingVertical: 14, borderRadius: 10, alignItems: 'center' },
//   roleBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8, backgroundColor: '#333', color:'#fff' },
//   selectedRole: { backgroundColor: '#00d1b2', color: '#121212' },
//   detailText: { color:'#fff', marginBottom:10, fontSize:16 }
// });
import { View, Text, ScrollView, Pressable, Modal, TextInput } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminStyles as s } from "./styles/adminStyles";
import AdminLayout from "./components/AdminLayout";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [current, setCurrent] = useState<User | null>(null);
  const [form, setForm] = useState({ name: "", email: "", role: "user", password: "" });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/auth/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const submit = async () => {
    const token = await AsyncStorage.getItem("token");
    if (current) {
      await axios.put(`http://localhost:5000/api/auth/users/${current.id}`, form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await axios.post("http://localhost:5000/api/auth/register", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
    setCurrent(null);
    setForm({ name: "", email: "", role: "user", password: "" });
    fetchUsers();
  };

  const deleteUser = async (id: number) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <AdminLayout>
    <ScrollView style={s.container}>
      <Text style={s.title}>Users</Text>

      <Pressable style={s.addBtn} onPress={() => setCurrent(null)}>
        <Text style={s.addText}>+ Add User</Text>
      </Pressable>

      {users.map(u => (
        <View key={u.id} style={s.cardColumn}>
          <Text style={s.name}>{u.name}</Text>
          <Text>{u.email}</Text>
          <Text>Role: {u.role}</Text>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Pressable onPress={() => { setCurrent(u); setForm({ ...u, password: "" }); }}>
              <Text style={s.link}>Edit</Text>
            </Pressable>
            <Pressable onPress={() => deleteUser(u.id)}>
              <Text style={s.delete}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {/* Modal */}
      <Modal visible={current !== null} transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>{current ? "Edit User" : "Add User"}</Text>

            <TextInput style={s.input} placeholder="Name" value={form.name} onChangeText={t => setForm({ ...form, name: t })} />
            <TextInput style={s.input} placeholder="Email" value={form.email} onChangeText={t => setForm({ ...form, email: t })} />
            {!current && (
              <TextInput style={s.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={t => setForm({ ...form, password: t })} />
            )}

            <Pressable style={s.saveBtn} onPress={submit}>
              <Text style={{ color: "#fff" }}>Save</Text>
            </Pressable>

            <Pressable onPress={() => setCurrent(null)}>
              <Text style={s.cancel}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
    </AdminLayout>
  );
}
