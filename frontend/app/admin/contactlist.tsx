import { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
} from "react-native";
import axios from "axios";
import Header from "../header";
import Footer from "../footer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

interface Contact {
  id: number;
  name: string;
  email: string;
  message: string;
}

export default function ContactList() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [role, setRole] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [searchEmail, setSearchEmail] = useState("");

  const API_URL = "http://localhost:5000/api";

  useEffect(() => {
    AsyncStorage.getItem("role").then((r) => setRole(r));
    fetchContacts();
  }, []);

  // Filter contacts whenever searchEmail or contacts change
  useEffect(() => {
    if (searchEmail.trim() === "") {
      setFilteredContacts(contacts);
    } else {
      setFilteredContacts(
        contacts.filter((c) =>
          c.email.toLowerCase().includes(searchEmail.toLowerCase())
        )
      );
    }
  }, [searchEmail, contacts]);

  const fetchContacts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await axios.get(`${API_URL}/contact`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      await axios.delete(`${API_URL}/contact/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContacts(contacts.filter((c) => c.id !== id));
      setModalMessage("Contact deleted successfully");
      setModalVisible(true);
    } catch (err) {
      console.log(err);
      setModalMessage("Could not delete contact");
      setModalVisible(true);
    }
  };

  const showDetails = (contact: Contact) => {
    setModalMessage(
      `Name: ${contact.name}\nEmail: ${contact.email}\nMessage: ${contact.message}`
    );
    setModalVisible(true);
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Header
        title="Contacts"
        role={role}
        cart={[]}
        favorites={[]}
        orders={[]}
        searchQuery=""
        setSearchQuery={() => {}}
        onMenuPress={() => {}}
        onLogout={async () => { await AsyncStorage.clear(); setRole(null); router.push("/"); }}
        onOrdersPress={() => {}}
      />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>All Contacts</Text>

        {/* Search by email */}
        <TextInput
          placeholder="Search by email"
          value={searchEmail}
          onChangeText={setSearchEmail}
          style={styles.searchInput}
        />

        <View style={styles.list}>
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <View key={contact.id} style={styles.contactItem}>
                <Text style={{ fontWeight: "600" }}>{contact.name}</Text>
                <Text>{contact.email}</Text>
                <View style={styles.buttons}>
                  <Pressable
                    style={styles.detailsBtn}
                    onPress={() => showDetails(contact)}
                  >
                    <Text style={{ color: "#fff" }}>Details</Text>
                  </Pressable>
                  <Pressable
                    style={styles.deleteBtn}
                    onPress={() => handleDelete(contact.id)}
                  >
                    <Text style={{ color: "#fff" }}>Delete</Text>
                  </Pressable>
                </View>
              </View>
            ))
          ) : (
            <Text style={{ margin: 20 }}>No contacts found</Text>
          )}
        </View>
        <Footer />
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>{modalMessage}</Text>
            <Pressable
              style={styles.modalBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cardBtnText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 22, fontWeight: "700", margin: 20 },
  searchInput: {
    backgroundColor: "#f0f0f0",
    marginHorizontal: 12,
    marginBottom: 15,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  list: { paddingHorizontal: 12, paddingBottom: 30 },
  contactItem: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  detailsBtn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginRight: 10,
  },
  deleteBtn: {
    backgroundColor: "red",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    maxHeight: "80%",
  },
  modalText: { fontSize: 16, marginBottom: 15, textAlign: "center", color: "#111" },
  modalBtn: { backgroundColor: "#000", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  cardBtnText: { color: "#fff", textAlign: "center", fontWeight: "600" },
});
