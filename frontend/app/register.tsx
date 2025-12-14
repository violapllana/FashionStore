import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';

export default function Register() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
      Alert.alert('Success', res.data.message);
      router.replace('/login'); // ridrejtim te login
    } catch (err) {
      console.log(err);
      Alert.alert('Registration Failed', err.response?.data?.message || 'Error');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.logo}>FashionStore</Text>
        <Text style={styles.title}>Create your account</Text>

        <TextInput
          placeholder="Name"
          placeholderTextColor="#777"
          style={styles.input}
          value={name}
          onChangeText={setName}
        />

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
          onPress={handleRegister}
        >
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        <Text
          style={styles.link}
          onPress={() => router.replace('/login')}
        >
          Already have an account? Login
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
