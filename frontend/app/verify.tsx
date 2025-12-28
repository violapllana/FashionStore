import { View, Text, StyleSheet, ActivityIndicator, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function VerifyEmail() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setMessage('Missing verification token.');
      setLoading(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/verify?token=${token}`);
        setMessage(res.data.message || 'Email verified successfully.');
        setSuccess(true);

        // AUTO LOGIN
        const loginRes = await axios.post('http://localhost:5000/api/auth/login', {
          email: res.data.email, // duhen dhënë nga backend
          password: res.data.tempPassword // opsionale, ose pyet user për login
        });
        await AsyncStorage.setItem('token', loginRes.data.accessToken);
        await AsyncStorage.setItem('userId', loginRes.data.user.id.toString());
        await AsyncStorage.setItem('role', loginRes.data.user.role);

      } catch (err: any) {
        setMessage(err.response?.data?.message || 'Verification failed or expired.');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, []);

  const resendEmail = async () => {
    setResendLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/resend-verification', { email: token }); // ose email i user
      Alert.alert('Success', 'Verification email sent again.');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to resend email.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <Text style={styles.title}>
              {success ? 'Email Verified 🎉' : 'Verification Failed'}
            </Text>
            <Text style={styles.message}>{message}</Text>

            {!success && (
              <Pressable style={styles.button} onPress={resendEmail} disabled={resendLoading}>
                <Text style={styles.buttonText}>{resendLoading ? 'Sending...' : 'Resend Email'}</Text>
              </Pressable>
            )}

            <Pressable style={[styles.button, { marginTop: 12 }]} onPress={() => router.replace('/login')}>
              <Text style={styles.buttonText}>Go to Login</Text>
            </Pressable>
          </>
        )}
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
    padding: 20
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0f0f0f',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center'
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center'
  },
  message: {
    color: '#aaa',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 10
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600'
  }
});
