import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');


  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem('role');
      if (role === 'admin') router.replace('/admin/AdminDashboard');
      else if (role) router.replace('/'); // user
    };
    checkRole();
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      const { accessToken, user } = res.data;

      // Ruaj token dhe role
      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('role', user.role);

      // Ridrejtim sipas role
      if (user.role === 'admin') {
        router.replace('/admin/AdminDashboard');
      } else {
        router.replace('/'); // user
      }
    } catch (err) {
      console.log(err);
      Alert.alert('Login Failed', 'Invalid email or password');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.logo}>FashionStore</Text>
        <Text style={styles.title}>Welcome back</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#777"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#777"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable
          style={styles.button}
          onPress={handleLogin}
        >
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Text
          style={styles.link}
          onPress={() => router.replace('/register')}
        >
          Don’t have an account? Register
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#000', justifyContent: 'center', alignItems: 'center', padding: 20 },
  card: { width: '100%', maxWidth: 380, backgroundColor: '#0f0f0f', borderRadius: 16, padding: 24 },
  logo: { color: '#fff', fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 4 },
  title: { color: '#999', fontSize: 14, textAlign: 'center', marginBottom: 28 },
  input: { backgroundColor: '#111', color: '#fff', borderRadius: 10, paddingVertical: 10, paddingHorizontal: 14, marginBottom: 14, fontSize: 14 },
  button: { backgroundColor: '#fff', paddingVertical: 12, borderRadius: 10, marginTop: 10 },
  buttonText: { color: '#000', fontSize: 14, fontWeight: '600', textAlign: 'center' },
  link: { color: '#777', textAlign: 'center', marginTop: 18, fontSize: 13 },
});
