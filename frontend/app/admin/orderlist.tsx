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
