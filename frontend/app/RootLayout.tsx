import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useRouter } from 'expo-router';

export const unstable_settings = {
  anchor: '(tabs)',
};

function Header() {
  const router = useRouter();

  return (
    <View style={styles.header}>
      <Text style={styles.logo}>FashionStore</Text>
      <View style={styles.menu}>
        <Pressable onPress={() => router.push('/')}>
          <Text style={styles.menuItem}>Home</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/about')}>
          <Text style={styles.menuItem}>About Us</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/products')}>
          <Text style={styles.menuItem}>Products</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/contact')}>
          <Text style={styles.menuItem}>Contact Us</Text>
        </Pressable>
      </View>
      <View style={styles.authButtons}>
        <Pressable style={styles.loginBtn} onPress={() => router.push('/login')}>
          <Text style={styles.authText}>Login</Text>
        </Pressable>
        <Pressable style={styles.registerBtn} onPress={() => router.push('/register')}>
          <Text style={styles.authText}>Register</Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Header />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  logo: { fontSize: 24, fontWeight: '700', color: '#111' },
  menu: { flexDirection: 'row', gap: 20 },
  menuItem: { fontSize: 16, color: '#555' },
  authButtons: { flexDirection: 'row', gap: 10 },
  loginBtn: { paddingVertical: 6, paddingHorizontal: 15, backgroundColor: '#000', borderRadius: 20 },
  registerBtn: { paddingVertical: 6, paddingHorizontal: 15, backgroundColor: '#ff4d6d', borderRadius: 20 },
  authText: { color: '#fff', fontWeight: '600' },
});
