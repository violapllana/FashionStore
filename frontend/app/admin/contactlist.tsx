import { View, Text, ScrollView, Pressable, Modal, TextInput } from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { adminStyles as s } from "./styles/adminStyles";
import AdminLayout from "./components/AdminLayout";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
}

export default function ContactList() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<Contact | null>(null);
  const [user, setUser] = useState<any>(null);


  useEffect(() => { fetchContacts();  fetchUser();}, []);

  const fetchContacts = async () => {
    const token = await AsyncStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/contact", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setContacts(res.data);
  };
  const fetchUser = async () => {
  const storedUser = await AsyncStorage.getItem("user");
  if (storedUser) {
    setUser(JSON.parse(storedUser));
  }
};

  const deleteContact = async (id: number) => {
    const token = await AsyncStorage.getItem("token");
    await axios.delete(`http://localhost:5000/api/contact/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
      <AdminLayout user={user}>
    <ScrollView style={s.container}>
      <Text style={s.title}>Contacts</Text>

      <TextInput
        style={s.input}
        placeholder="Search by email"
        value={search}
        onChangeText={setSearch}
      />

      {contacts
        .filter(c => c.email.toLowerCase().includes(search.toLowerCase()))
        .map(c => (
          <View key={c.id} style={s.cardColumn}>
            <Text style={s.name}>{c.name}</Text>
            <Text>{c.email}</Text>

            <View style={{ flexDirection: "row", marginTop: 10 }}>
              <Pressable onPress={() => setModal(c)}>
                <Text style={s.link}>Details</Text>
              </Pressable>
              <Pressable onPress={() => deleteContact(c.id)}>
                <Text style={s.delete}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}

      {/* Details Modal */}
      <Modal visible={!!modal} transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>{modal?.name}</Text>
            <Text>Email: {modal?.email}</Text>
            <Text>Message: {modal?.message}</Text>
            <Pressable onPress={() => setModal(null)}>
              <Text style={s.cancel}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
      </AdminLayout>
  );
}
