import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [serverMessage, setServerMessage] = useState('');

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmailError('');
    if (!email) {
      setEmailError('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Enter a valid email');
      return false;
    }
    return true;
  };

  const handleForgotPassword = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      console.log(res.data); // Për development
      setServerMessage(res.data.message);

      // Në backend-in tënd, URL-ja shfaqet në console.log për testim
      Alert.alert('Success', 'Check console for reset URL (for testing)');
    } catch (err) {
      const errorMessage = err instanceof axios.AxiosError ? err.response?.data?.message : (err instanceof Error ? err.message : 'Unknown error');
      console.log(errorMessage);
      setServerMessage('Something went wrong. Try again.');
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.title}>Forgot Password</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#777"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        {serverMessage ? <Text style={styles.message}>{serverMessage}</Text> : null}

        <Pressable style={styles.button} onPress={handleForgotPassword}>
          <Text style={styles.buttonText}>Send Reset Link</Text>
        </Pressable>

        <Text style={styles.link} onPress={() => router.replace('/login')}>
          Back to Login
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    padding: 24,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 10,
  },
  error: {
    color: '#ff4d4d',
    fontSize: 12,
    marginBottom: 8,
  },
  message: {
    color: '#00ff00',
    fontSize: 13,
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    color: '#777',
    textAlign: 'center',
    marginTop: 18,
    fontSize: 13,
  },
});
