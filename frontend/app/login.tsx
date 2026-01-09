import { View, Text, TextInput, StyleSheet, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [serverError, setServerError] = useState('');

  useEffect(() => {
    const checkRole = async () => {
      const role = await AsyncStorage.getItem('role');
      if (role === 'admin') router.replace('/admin/dashboard');
      else if (role === 'user') router.replace('/');
    };
    checkRole();
  }, []);

  const validate = () => {
  let valid = true;
  setEmailError('');
  setPasswordError('');
  setServerError('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email) {
    setEmailError('Email is required');
    valid = false;
  } else if (!emailRegex.test(email)) {
    setEmailError('Please enter a valid email address');
    valid = false;
  }

  if (!password) {
    setPasswordError('Password is required');
    valid = false;
  } else if (password.length < 6) {
    setPasswordError('Password must be at least 6 characters long');
    valid = false;
  }

  return valid;
};


  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      const { accessToken, user } = res.data;

      await AsyncStorage.setItem('token', accessToken);
      await AsyncStorage.setItem('userId', user.id.toString());
      await AsyncStorage.setItem('role', user.role);

      if (user.role === 'admin') router.replace('/admin/dashboard');
      else router.replace('/');
    }catch (err) {
  setServerError('Invalid email or password');
}

  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <Text style={styles.logo}>FashionStore</Text>
        <Text style={styles.title}>Welcome back</Text>

        {/* EMAIL */}
        <TextInput
          placeholder="Email"
          placeholderTextColor="#777"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        {emailError ? <Text style={styles.error}>{emailError}</Text> : null}

        {/* PASSWORD */}
        <View style={styles.passwordWrapper}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#777"
            style={styles.passwordInput}
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
          />
          <Pressable onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={22}
              color="#777"
            />
          </Pressable>
        </View>
        {passwordError ? <Text style={styles.error}>{passwordError}</Text> : null}

        {serverError ? <Text style={styles.errorCenter}>{serverError}</Text> : null}

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Text style={styles.link} onPress={() => router.replace('/register')}>
          Don’t have an account? Register
        </Text>

        <Text style={styles.link} onPress={() => router.push('/ForgotPassword')}>
  Forgot Password?
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
  logo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  title: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 14,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 10,
    paddingHorizontal: 14,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 10,
    fontSize: 14,
  },
  error: {
    color: '#ff4d4d',
    fontSize: 12,
    marginTop: 4,
    marginBottom: 8,
  },
  errorCenter: {
    color: '#ff4d4d',
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 10,
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
