import { View, Text, StyleSheet, Pressable } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function AdminSidebar() {
  const router = useRouter();

  const logout = async () => {
    await AsyncStorage.clear();
    router.replace('/');
  };

  return (
    <View style={styles.sidebar}>
      {/* LOGO */}
      <Text style={styles.logo}>FashionStore</Text>

      {/* MENU */}
      <SidebarItem icon="home" label="Home" route="/" />
      <SidebarItem icon="dashboard" label="Dashboard" route="/admin/dashboard" active />
      <SidebarItem icon="people" label="Customers" route="/admin/users" />
      <SidebarItem icon="inventory" label="Products" route="/admin/products" />
      <SidebarItem icon="shopping-cart" label="Orders" route="/admin/orderlist" />
      <SidebarItem icon="mail" label="Mail" route="/admin/contactlist" />
      <SidebarItem icon="person" label="My Profile" route="/admin/Profile" />

      {/* FOOTER */}
      <View style={styles.footer}>
        <Pressable style={styles.logoutBtn} onPress={logout}>
          <MaterialIcons name="logout" size={20} color="#ff4d4f" />
          <Text style={styles.logoutText}>Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}

function SidebarItem({ icon, label, route, active = false }: any) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(route)}
      style={[styles.item, active && styles.activeItem]}
    >
      <MaterialIcons
        name={icon}
        size={22}
        color={active ? '#6c63ff' : '#777'}
      />
      <Text style={[styles.text, active && styles.activeText]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 240,
    backgroundColor: '#fff',
    padding: 20,
    borderRightWidth: 1,
    borderColor: '#eee',
  },

  logo: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 30,
    color: '#111',
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 14,
    paddingHorizontal: 10,
    borderRadius: 10,
  },

  activeItem: {
    backgroundColor: '#f0efff',
  },

  text: {
    fontSize: 16,
    color: '#555',
  },

  activeText: {
    fontWeight: '600',
    color: '#6c63ff',
  },

  footer: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff1f0',
  },

  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ff4d4f',
  },
});
