import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { label: 'Users', route: '/admin/users' },
    { label: 'Products', route: '/admin/products' },
    { label: 'Cart', route: '/admin/cart' },
    { label: 'Favorites', route: '/admin/favorites' },
  ];

  const handleNavigate = (route: string) => {
    setSidebarOpen(false);
    router.push(route as any);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.push('/');
  };

  return (
    <View style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Pressable onPress={() => setSidebarOpen(true)}>
          <Text style={styles.menuIcon}>☰</Text>
        </Pressable>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      {/* CONTENT */}
      <View style={styles.content}>
        <Text style={styles.welcome}>Welcome, Admin 👋</Text>
        <Text style={styles.info}>
          Select a section from the menu
        </Text>
      </View>

      {/* SIDEBAR OVERLAY */}
      {sidebarOpen && (
        <View style={styles.overlay}>
          <View style={styles.sidebar}>
            <Text style={styles.logo}>FashionStore</Text>

            {menuItems.map(item => (
              <Pressable
                key={item.label}
                style={styles.menuItem}
                onPress={() => handleNavigate(item.route)}
              >
                <Text style={styles.menuText}>{item.label}</Text>
              </Pressable>
            ))}

            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
              <Text style={styles.logoutText}>Logout</Text>
            </Pressable>

            <Pressable
              style={styles.closeBtn}
              onPress={() => setSidebarOpen(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topBar: {
    height: 60,
    backgroundColor: '#000',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  menuIcon: {
    color: '#fff',
    fontSize: 26,
    marginRight: 15,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
  },
  info: {
    marginTop: 10,
    color: '#666',
  },

  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.3)',
  },

  sidebar: {
    width: width * 0.7,
    height: '100%',
    backgroundColor: '#f8f8f8',
    padding: 20,
  },

  logo: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 30,
  },

  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 16,
  },

  logoutBtn: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#ff4d6d',
    borderRadius: 10,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  closeBtn: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#000',
    borderRadius: 10,
  },
  closeText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },
});

