// import { View, Text, ScrollView, StyleSheet, Alert, Pressable, Modal, Picker } from 'react-native';
// import { useEffect, useState } from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import axios from 'axios';

// interface OrderItem {
//   id: number;
//   quantity: number;
//   price: number;
//   Product: { id: number; name: string; price: number };
// }

// interface Order {
//   id: number;
//   totalPrice: number;
//   status: string;
//   items: OrderItem[];
//   User?: { email: string };
// }

// export default function OrdersList() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [statusModalVisible, setStatusModalVisible] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
//   const [sortOption, setSortOption] = useState<'newest' | 'oldest'>('newest');

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   useEffect(() => {
//     sortOrders(sortOption);
//   }, [sortOption, orders]);

//   const fetchOrders = async () => {
//     try {
//       setLoading(true);
//       const token = await AsyncStorage.getItem('token');
//       if (!token) {
//         Alert.alert('Error', 'Please login first');
//         return;
//       }

//       const res = await axios.get('http://localhost:5000/api/orders', {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOrders(Array.isArray(res.data) ? res.data : [res.data]);
//     } catch (err) {
//       console.log(err);
//       Alert.alert('Error', 'Could not fetch orders');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const sortOrders = (option: 'newest' | 'oldest') => {
//     setOrders(prev => [...prev].sort((a, b) => {
//       if (option === 'newest') return b.id - a.id; // te rejat → lart
//       return a.id - b.id; // te vjetrat → lart
//     }));
//   };

//   const deleteOrder = async (id: number) => {
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) return;

//       await axios.delete(`http://localhost:5000/api/orders/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOrders(prev => prev.filter(order => order.id !== id));
//       Alert.alert('Success', 'Order deleted');
//     } catch (err) {
//       console.log(err);
//       Alert.alert('Error', 'Could not delete order');
//     }
//   };

//   const updateStatus = async (status: string) => {
//     if (!selectedOrder) return;
//     try {
//       const token = await AsyncStorage.getItem('token');
//       if (!token) return;

//       await axios.put(`http://localhost:5000/api/orders/${selectedOrder.id}`, { status }, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setOrders(prev => prev.map(order => order.id === selectedOrder.id ? { ...order, status } : order));
//       setStatusModalVisible(false);
//     } catch (err) {
//       console.log(err);
//       Alert.alert('Error', 'Could not update status');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.title}>Manage Orders</Text>

//       {/* Sort Buttons */}
//       <View style={{ flexDirection:'row', marginBottom:10, gap:10 }}>
//         <Pressable
//           style={[styles.btn, sortOption==='newest'?{backgroundColor:'#0066ff'}:{}]}
//           onPress={()=>setSortOption('newest')}
//         >
//           <Text style={styles.btnText}>Newest</Text>
//         </Pressable>
//         <Pressable
//           style={[styles.btn, sortOption==='oldest'?{backgroundColor:'#0066ff'}:{}]}
//           onPress={()=>setSortOption('oldest')}
//         >
//           <Text style={styles.btnText}>Oldest</Text>
//         </Pressable>
//       </View>

//       <View style={styles.table}>
//         <View style={[styles.row, styles.headerRow]}>
//           <Text style={[styles.cell, styles.headerText]}>ID</Text>
//           <Text style={[styles.cell, styles.headerText]}>User</Text>
//           <Text style={[styles.cell, styles.headerText]}>Total</Text>
//           <Text style={[styles.cell, styles.headerText]}>Status</Text>
//           <Text style={[styles.cell, styles.headerText, styles.actionsCol]}>Actions</Text>
//         </View>

//         <ScrollView style={{ maxHeight: 500 }}>
//           {loading ? (
//             <Text style={{ padding: 20, color:'#fff' }}>Loading...</Text>
//           ) : orders.length === 0 ? (
//             <Text style={{ padding: 20, color:'#fff' }}>No orders found</Text>
//           ) : (
//             orders.map(order => (
//               <View key={order.id} style={styles.row}>
//                 <Text style={styles.cell}>{order.id}</Text>
//                 <Text style={styles.cell}>{order.User?.email || '-'}</Text>
//                 <Text style={styles.cell}>${order.totalPrice?.toFixed(2)}</Text>
//                 <Text style={styles.cell}>{order.status}</Text>
//                 <View style={[styles.cell, styles.actionsCol]}>
//                   <Pressable
//                     style={styles.editBtn}
//                     onPress={() => { setSelectedOrder(order); setStatusModalVisible(true); }}
//                   >
//                     <Text style={styles.btnText}>Edit</Text>
//                   </Pressable>
//                   <Pressable
//                     style={styles.deleteBtn}
//                     onPress={() => deleteOrder(order.id)}
//                   >
//                     <Text style={styles.btnText}>Delete</Text>
//                   </Pressable>
//                 </View>
//               </View>
//             ))
//           )}
//         </ScrollView>
//       </View>

//       {/* Status Modal */}
//       <Modal visible={statusModalVisible} animationType="slide" transparent={true}>
//         <View style={styles.modalOverlay}>
//           <View style={styles.modalContent}>
//             <Text style={styles.modalTitle}>Update Status</Text>
//             {['pending', 'completed', 'canceled'].map(status => (
//               <Pressable
//                 key={status}
//                 style={[styles.btn, { marginBottom: 10 }]}
//                 onPress={() => updateStatus(status)}
//               >
//                 <Text style={styles.btnText}>{status}</Text>
//               </Pressable>
//             ))}
//             <Pressable style={[styles.btn, { backgroundColor:'#6c757d' }]} onPress={() => setStatusModalVisible(false)}>
//               <Text style={styles.btnText}>Cancel</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex:1, padding:20, backgroundColor:'#121212' },
//   title: { fontSize:32, fontWeight:'700', color:'#00d1b2', marginBottom:20 },
//   table: { backgroundColor:'#1e1e1e', borderRadius:12, overflow:'hidden', elevation:2 },
//   row: { flexDirection:'row', alignItems:'center', paddingVertical:16, paddingHorizontal:12, borderBottomWidth:1, borderBottomColor:'#333' },
//   headerRow: { backgroundColor:'#272727' },
//   cell: { flex:1, fontSize:15, color:'#fff' },
//   headerText: { color:'#00d1b2', fontWeight:'700', fontSize:16 },
//   actionsCol: { flexDirection:'row', justifyContent:'flex-end', gap:10 },
//   editBtn: { backgroundColor:'#0066ff', paddingVertical:8, paddingHorizontal:18, borderRadius:8 },
//   deleteBtn: { backgroundColor:'#ff3860', paddingVertical:8, paddingHorizontal:18, borderRadius:8 },
//   btnText: { color:'#fff', fontWeight:'700', textAlign:'center' },
//   modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.8)', justifyContent:'center', padding:20 },
//   modalContent: { backgroundColor:'#1e1e1e', borderRadius:12, padding:20 },
//   modalTitle: { fontSize:24, fontWeight:'700', marginBottom:20, color:'#00d1b2' },
//   btn: { backgroundColor:'#00d1b2', paddingVertical:14, borderRadius:10, alignItems:'center' },
// });
import { View, Text, ScrollView, Pressable, Modal } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminStyles as s } from "./styles/adminStyles";
import AdminLayout from "./components/AdminLayout";

interface Order {
  id: number;
  totalPrice: number;
  status: string;
  User?: { email: string };
}

export default function OrdersList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [current, setCurrent] = useState<Order | null>(null);

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/orders", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  };

  const updateStatus = async (status: string) => {
    if (!current) return;
    const token = await AsyncStorage.getItem("token");
    await axios.put(`http://localhost:5000/api/orders/${current.id}`, { status }, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(prev => prev.map(o => o.id === current.id ? { ...o, status } : o));
    setCurrent(null);
  };

  const deleteOrder = async (id: number) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  return (
      <AdminLayout >
    <ScrollView style={s.container}>
      <Text style={s.title}>Orders</Text>

      {orders.map(o => (
        <View key={o.id} style={s.cardColumn}>
          <Text style={s.name}>Order #{o.id}</Text>
          <Text>Total: ${o.totalPrice}</Text>
          <Text>Status: {o.status}</Text>
          <Text>User: {o.User?.email}</Text>

          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <Pressable onPress={() => setCurrent(o)}>
              <Text style={s.link}>Edit Status</Text>
            </Pressable>
            <Pressable onPress={() => deleteOrder(o.id)}>
              <Text style={s.delete}>Delete</Text>
            </Pressable>
          </View>
        </View>
      ))}

      {/* Status Modal */}
      <Modal visible={!!current} transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Update Status</Text>
            {["pending", "completed", "canceled"].map(st => (
              <Pressable key={st} style={s.addBtn} onPress={() => updateStatus(st)}>
                <Text style={s.addText}>{st}</Text>
              </Pressable>
            ))}
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
