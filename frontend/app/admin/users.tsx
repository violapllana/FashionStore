// import { View, Text, ScrollView, Pressable, Modal, TextInput } from "react-native";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { adminStyles as s } from "./styles/adminStyles";
// import AdminLayout from "./components/AdminLayout";

// interface User {
//   id: number;
//   name: string;
//   email: string;
//   role: string;
// }

// export default function ManageUsers() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [current, setCurrent] = useState<User | null>(null);
//   const [form, setForm] = useState({ name: "", email: "", role: "user", password: "" });

//   useEffect(() => { fetchUsers(); }, []);

//   const fetchUsers = async () => {
//     const token = await AsyncStorage.getItem("token");
//     const res = await axios.get("http://localhost:5000/api/auth/users", {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUsers(res.data);
//   };

//   const submit = async () => {
//     const token = await AsyncStorage.getItem("token");
//     if (current) {
//       await axios.put(`http://localhost:5000/api/auth/users/${current.id}`, form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     } else {
//       await axios.post("http://localhost:5000/api/auth/register", form, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//     }
//     setCurrent(null);
//     setForm({ name: "", email: "", role: "user", password: "" });
//     fetchUsers();
//   };

//   const deleteUser = async (id: number) => {
//     const token = await AsyncStorage.getItem("token");
//     await axios.delete(`http://localhost:5000/api/auth/users/${id}`, {
//       headers: { Authorization: `Bearer ${token}` },
//     });
//     setUsers(prev => prev.filter(u => u.id !== id));
//   };

//   return (
//     <AdminLayout>
//     <ScrollView style={s.container}>
//       <Text style={s.title}>Users</Text>

//       <Pressable style={s.addBtn} onPress={() => setCurrent(null)}>
//         <Text style={s.addText}>+ Add User</Text>
//       </Pressable>

//       {users.map(u => (
//         <View key={u.id} style={s.cardColumn}>
//           <Text style={s.name}>{u.name}</Text>
//           <Text>{u.email}</Text>
//           <Text>Role: {u.role}</Text>

//           <View style={{ flexDirection: "row", marginTop: 10 }}>
//             <Pressable onPress={() => { setCurrent(u); setForm({ ...u, password: "" }); }}>
//               <Text style={s.link}>Edit</Text>
//             </Pressable>
//             <Pressable onPress={() => deleteUser(u.id)}>
//               <Text style={s.delete}>Delete</Text>
//             </Pressable>
//           </View>
//         </View>
//       ))}

//       {/* Modal */}
//       <Modal visible={current !== null} transparent>
//         <View style={s.overlay}>
//           <View style={s.modal}>
//             <Text style={s.modalTitle}>{current ? "Edit User" : "Add User"}</Text>

//             <TextInput style={s.input} placeholder="Name" value={form.name} onChangeText={t => setForm({ ...form, name: t })} />
//             <TextInput style={s.input} placeholder="Email" value={form.email} onChangeText={t => setForm({ ...form, email: t })} />
//             {!current && (
//               <TextInput style={s.input} placeholder="Password" secureTextEntry value={form.password} onChangeText={t => setForm({ ...form, password: t })} />
//             )}

//             <Pressable style={s.saveBtn} onPress={submit}>
//               <Text style={{ color: "#fff" }}>Save</Text>
//             </Pressable>

//             <Pressable onPress={() => setCurrent(null)}>
//               <Text style={s.cancel}>Cancel</Text>
//             </Pressable>
//           </View>
//         </View>
//       </Modal>
//     </ScrollView>
//     </AdminLayout>
//   );
// }
import {
  View,
  Text,
  ScrollView,
  Pressable,
  Modal,
  TextInput,
} from "react-native";
import { useEffect, useState } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { adminStyles as s } from "./styles/adminStyles";
import AdminLayout from "./components/AdminLayout";

interface User {
  id: number;
  name: string;
  email: string;
  role: "user" | "admin";
}

const API = "http://localhost:5000/api/auth";

export default function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [current, setCurrent] = useState<User | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    password: "",
  });

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | "user" | "admin">("all");

  useEffect(() => {
    fetchUsers();
  }, []);

  const authHeader = async () => ({
    headers: {
      Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
    },
  });

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/users`, await authHeader());
    setUsers(res.data);
  };

  const openAdd = () => {
    setCurrent(null);
    setForm({ name: "", email: "", role: "user", password: "" });
    setModalOpen(true);
  };

  const openEdit = (u: User) => {
    setCurrent(u);
    setForm({ name: u.name, email: u.email, role: u.role, password: "" });
    setModalOpen(true);
  };

  const submit = async () => {
    if (current) {
      await axios.put(
        `${API}/users/${current.id}`,
        form,
        await authHeader()
      );
    } else {
      await axios.post(`${API}/users`, form, await authHeader());
    }

    setModalOpen(false);
    fetchUsers();
  };

  const deleteUser = async (id: number) => {
    await axios.delete(`${API}/users/${id}`, await authHeader());
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  const filteredUsers = users.filter(u => {
    const text =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const roleMatch =
      roleFilter === "all" || u.role === roleFilter;

    return text && roleMatch;
  });

  return (
    <AdminLayout>
      <ScrollView style={s.container}>
        <Text style={s.title}>Users</Text>

        {/* Search */}
        <TextInput
          style={s.input}
          placeholder="Search name or email"
          value={search}
          onChangeText={setSearch}
        />

        {/* Filter */}
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
          {["all", "user", "admin"].map(r => (
            <Pressable
              key={r}
              onPress={() => setRoleFilter(r as any)}
              style={[
                s.filterBtn,
                roleFilter === r && s.filterActive,
              ]}
            >
              <Text
                style={{
                  color: roleFilter === r ? "#fff" : "#000",
                }}
              >
                {r.toUpperCase()}
              </Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={s.addBtn} onPress={openAdd}>
          <Text style={s.addText}>+ Add User</Text>
        </Pressable>

        {filteredUsers.map(u => (
          <View key={u.id} style={s.cardColumn}>
            <Text style={s.name}>{u.name}</Text>
            <Text>{u.email}</Text>
            <Text>Role: {u.role}</Text>

            <View style={{ flexDirection: "row", gap: 15, marginTop: 10 }}>
              <Pressable onPress={() => openEdit(u)}>
                <Text style={s.link}>Edit</Text>
              </Pressable>
              <Pressable onPress={() => deleteUser(u.id)}>
                <Text style={s.delete}>Delete</Text>
              </Pressable>
            </View>
          </View>
        ))}

        {/* MODAL */}
        <Modal visible={modalOpen} transparent animationType="fade">
          <View style={s.overlay}>
            <View style={s.modal}>
              <Text style={s.modalTitle}>
                {current ? "Edit User" : "Add User"}
              </Text>

              <TextInput
                style={s.input}
                placeholder="Name"
                value={form.name}
                onChangeText={t => setForm({ ...form, name: t })}
              />

              <TextInput
                style={s.input}
                placeholder="Email"
                value={form.email}
                onChangeText={t => setForm({ ...form, email: t })}
              />

              {!current && (
                <TextInput
                  style={s.input}
                  placeholder="Password"
                  secureTextEntry
                  value={form.password}
                  onChangeText={t =>
                    setForm({ ...form, password: t })
                  }
                />
              )}

              {/* ROLE */}
              <View style={{ flexDirection: "row", gap: 10, marginBottom: 20 }}>
                {["user", "admin"].map(r => (
                  <Pressable
                    key={r}
                    onPress={() => setForm({ ...form, role: r })}
                    style={[
                      s.roleBtn,
                      form.role === r && s.roleActive,
                    ]}
                  >
                    <Text
                      style={{
                        color: form.role === r ? "#fff" : "#000",
                      }}
                    >
                      {r.toUpperCase()}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Pressable style={s.saveBtn} onPress={submit}>
                <Text style={{ color: "#fff" }}>Save</Text>
              </Pressable>

              <Pressable onPress={() => setModalOpen(false)}>
                <Text style={s.cancel}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </AdminLayout>
  );
}
