import { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Dimensions,
  ScrollView,
  Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AdminDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [pressAnim] = useState(new Animated.Value(1));

  const menuItems = [
    { label: 'Users', route: '/admin/users', icon: <MaterialIcons name="people" size={28} color="#fff" /> },
    { label: 'Products', route: '/admin/products', icon: <FontAwesome5 name="box" size={28} color="#fff" /> },
    { label: 'Cart', route: '/admin/cart', icon: <MaterialIcons name="shopping-cart" size={28} color="#fff" /> },
    { label: 'Favorites', route: '/admin/favorites', icon: <MaterialIcons name="favorite" size={28} color="#fff" /> },
  ];

  const handleNavigate = (route: string) => {
    setSidebarOpen(false);
    router.push(route as any);
  };

  const handleLogout = async () => {
    await AsyncStorage.clear();
    router.push('/');
  };

  const handlePressIn = () => {
    Animated.spring(pressAnim, { toValue: 0.95, useNativeDriver: true }).start();
  };

  const handlePressOut = () => {
    Animated.spring(pressAnim, { toValue: 1, friction: 3, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      {/* TOP BAR */}
      <View style={styles.topBar}>
        <Pressable onPress={() => setSidebarOpen(true)}>
          <MaterialIcons name="menu" size={28} color="#1e90ff" />
        </Pressable>
        <Text style={styles.title}>Admin Dashboard</Text>
      </View>

      {/* CONTENT */}
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <Text style={styles.welcome}>Welcome, Admin 👋</Text>
          <Text style={styles.info}>Manage your store efficiently</Text>

          <View style={styles.quickLinks}>
            {menuItems.map((item, idx) => (
              <Animated.View key={idx} style={{ transform: [{ scale: pressAnim }] }}>
                <Pressable
                  style={styles.quickLinkBtn}
                  onPress={() => handleNavigate(item.route)}
                  onPressIn={handlePressIn}
                  onPressOut={handlePressOut}
                >
                  {item.icon}
                  <Text style={styles.quickLinkText}>{item.label}</Text>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        </View>
      </ScrollView>

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
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                  {item.icon}
                  <Text style={styles.menuText}>{item.label}</Text>
                </View>
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
  container: { flex: 1, backgroundColor: '#0d1117' },

  topBar: {
    height: 60,
    backgroundColor: '#161b22',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    elevation: 5,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginLeft: 15,
  },

  content: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
  },
  card: {
    width: '100%',
    backgroundColor: '#1e1e1e',
    borderRadius: 20,
    padding: 25,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 10,
    elevation: 5,
    alignItems: 'center',
  },
  welcome: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1e90ff',
  },
  info: {
    marginTop: 10,
    color: '#ccc',
    fontSize: 16,
    textAlign: 'center',
  },
  quickLinks: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 25,
    justifyContent: 'center',
    gap: 15,
  },
  quickLinkBtn: {
    backgroundColor: '#1e90ff',
    width: 120,
    height: 120,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: '#1e90ff',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 10,
    elevation: 5,
  },
  quickLinkText: {
    color: '#0d1117',
    fontWeight: '700',
    fontSize: 14,
    textAlign: 'center',
  },

  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },

  sidebar: {
    width: width * 0.7,
    height: '100%',
    backgroundColor: '#161b22',
    padding: 25,
  },

  logo: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 30,
    color: '#1e90ff',
  },

  menuItem: {
    paddingVertical: 15,
  },
  menuText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#fff',
  },

  logoutBtn: {
    marginTop: 30,
    padding: 12,
    backgroundColor: '#ff3860',
    borderRadius: 10,
    shadowColor: '#ff3860',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  logoutText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: '700',
  },

  closeBtn: {
    marginTop: 15,
    padding: 12,
    backgroundColor: '#0d1117',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#1e90ff',
  },
  closeText: {
    color: '#1e90ff',
    textAlign: 'center',
    fontWeight: '700',
  },
});
