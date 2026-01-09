// import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
// import { useRouter } from 'expo-router';
// import { useState } from 'react';
// import axios from 'axios';
// import { Ionicons } from '@expo/vector-icons';

// export default function Register() {
//   const router = useRouter();

//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirm, setShowConfirm] = useState(false);

//   const [nameError, setNameError] = useState('');
//   const [emailError, setEmailError] = useState('');
//   const [passwordError, setPasswordError] = useState('');
//   const [confirmError, setConfirmError] = useState('');
//   const [serverError, setServerError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const validate = () => {
//     let valid = true;

//     setNameError('');
//     setEmailError('');
//     setPasswordError('');
//     setConfirmError('');
//     setServerError('');

//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const passwordRegex = /^[A-Z][A-Za-z0-9]{4,}$/;
//     const hasNumber = /\d/;

//     if (!name) {
//       setNameError('Name is required');
//       valid = false;
//     }

//     if (!email) {
//       setEmailError('Email is required');
//       valid = false;
//     } else if (!emailRegex.test(email)) {
//       setEmailError('Please enter a valid email address');
//       valid = false;
//     }

//     if (!password) {
//       setPasswordError('Password is required');
//       valid = false;
//     } else if (!passwordRegex.test(password) || !hasNumber.test(password)) {
//       setPasswordError(
//         'Password must start with a capital letter, contain at least one number, and be at least 5 characters long'
//       );
//       valid = false;
//     }

//     if (!confirmPassword) {
//       setConfirmError('Please confirm your password');
//       valid = false;
//     } else if (password !== confirmPassword) {
//       setConfirmError('Passwords do not match');
//       valid = false;
//     }

//     return valid;
//   };

//   const handleRegister = async () => {
//     if (!validate()) return;

//     try {
//       await axios.post('http://localhost:5000/api/auth/register', {
//         name,
//         email,
//         password,
//       });

// setSuccessMessage(
//   'Account created successfully. Please check your email to verify your account.'
// );

//     } catch (err) {
//       setServerError(err.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <View style={styles.screen}>
//       <View style={styles.card}>
//         <Text style={styles.logo}>FashionStore</Text>
//         <Text style={styles.title}>Create your account</Text>

//         {/* NAME */}
//         <TextInput
//           placeholder="Name"
//           placeholderTextColor="#777"
//           style={styles.input}
//           value={name}
//           onChangeText={setName}
//         />
//         {nameError && <Text style={styles.error}>{nameError}</Text>}

//         {/* EMAIL */}
//         <TextInput
//           placeholder="Email"
//           placeholderTextColor="#777"
//           style={styles.input}
//           value={email}
//           onChangeText={setEmail}
//           autoCapitalize="none"
//         />
//         {emailError && <Text style={styles.error}>{emailError}</Text>}

//         {/* PASSWORD */}
//         <View style={styles.passwordWrapper}>
//           <TextInput
//             placeholder="Password"
//             placeholderTextColor="#777"
//             style={styles.passwordInput}
//             secureTextEntry={!showPassword}
//             value={password}
//             onChangeText={setPassword}
//           />
//           <Pressable onPress={() => setShowPassword(!showPassword)}>
//             <Ionicons
//               name={showPassword ? 'eye-off-outline' : 'eye-outline'}
//               size={22}
//               color="#777"
//             />
//           </Pressable>
//         </View>
//         {passwordError && <Text style={styles.error}>{passwordError}</Text>}

//         {/* CONFIRM PASSWORD */}
//         <View style={styles.passwordWrapper}>
//           <TextInput
//             placeholder="Confirm Password"
//             placeholderTextColor="#777"
//             style={styles.passwordInput}
//             secureTextEntry={!showConfirm}
//             value={confirmPassword}
//             onChangeText={setConfirmPassword}
//           />
//           <Pressable onPress={() => setShowConfirm(!showConfirm)}>
//             <Ionicons
//               name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
//               size={22}
//               color="#777"
//             />
//           </Pressable>
//         </View>
//         {confirmError && <Text style={styles.error}>{confirmError}</Text>}

//         {serverError && <Text style={styles.errorCenter}>{serverError}</Text>}

//         {successMessage ? (
//           <>
//             <Text style={styles.success}>{successMessage}</Text>
//             <Pressable style={styles.button} onPress={() => router.replace('/login')}>
//               <Text style={styles.buttonText}>Go to Login</Text>
//             </Pressable>
//           </>
//         ) : (
//           <Pressable style={styles.button} onPress={handleRegister}>
//             <Text style={styles.buttonText}>Register</Text>
//           </Pressable>
//         )}

//         {!successMessage && (
//           <Text style={styles.link} onPress={() => router.replace('/login')}>
//             Already have an account? Login
//           </Text>
//         )}
//       </View>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   screen: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//   },
//   card: {
//     width: '100%',
//     maxWidth: 380,
//     backgroundColor: '#0f0f0f',
//     borderRadius: 18,
//     padding: 24,
//   },
//   logo: {
//     color: '#fff',
//     fontSize: 28,
//     fontWeight: 'bold',
//     textAlign: 'center',
//   },
//   title: {
//     color: '#999',
//     fontSize: 14,
//     textAlign: 'center',
//     marginBottom: 18,
//   },
//   input: {
//     backgroundColor: '#111',
//     color: '#fff',
//     borderRadius: 10,
//     paddingVertical: 9,
//     paddingHorizontal: 14,
//     fontSize: 14,
//     marginBottom: 6,
//   },
//   passwordWrapper: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     backgroundColor: '#111',
//     borderRadius: 10,
//     paddingHorizontal: 14,
//     marginBottom: 6,
//   },
//   passwordInput: {
//     flex: 1,
//     color: '#fff',
//     paddingVertical: 9,
//     fontSize: 14,
//   },
//   error: {
//     color: '#ff4d4d',
//     fontSize: 12,
//     marginBottom: 6,
//   },
//   errorCenter: {
//     color: '#ff4d4d',
//     fontSize: 13,
//     textAlign: 'center',
//     marginVertical: 6,
//   },
//   success: {
//     color: '#4CAF50',
//     fontSize: 13,
//     textAlign: 'center',
//     marginVertical: 8,
//   },
//   button: {
//     backgroundColor: '#fff',
//     paddingVertical: 12,
//     borderRadius: 10,
//     marginTop: 8,
//   },
//   buttonText: {
//     color: '#000',
//     fontSize: 14,
//     fontWeight: '600',
//     textAlign: 'center',
//   },
//   link: {
//     color: '#777',
//     textAlign: 'center',
//     marginTop: 14,
//     fontSize: 13,
//   },
// });
import { View, Text, TextInput, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import UserLayout from './user/components/UserLayout';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Register() {
  const router = useRouter();

  const [role, setRole] = useState<string | null>(null);
  const [cart, setCart] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const [serverError, setServerError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
  };

  const validate = () => {
    let valid = true;

    setNameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmError('');
    setServerError('');

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^[A-Z][A-Za-z0-9]{4,}$/;
    const hasNumber = /\d/;

    if (!name) {
      setNameError('Name is required');
      valid = false;
    }

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
    } else if (!passwordRegex.test(password) || !hasNumber.test(password)) {
      setPasswordError(
        'Password must start with a capital letter, contain at least one number, and be at least 5 characters long'
      );
      valid = false;
    }

    if (!confirmPassword) {
      setConfirmError('Please confirm your password');
      valid = false;
    } else if (password !== confirmPassword) {
      setConfirmError('Passwords do not match');
      valid = false;
    }

    return valid;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password,
      });

      setSuccessMessage(
        'Account created successfully. Please check your email to verify your account.'
      );
    } catch (err: any) {
      setServerError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <UserLayout
      role={role}
      cart={cart}
      favorites={favorites}
      orders={orders}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      onLogout={handleLogout}
      onRemoveFavorite={() => {}}
      onChangeQty={() => {}}
      onOrder={() => {}}
    >
      <View style={styles.screen}>
        <View style={styles.card}>
          <Text style={styles.logo}>FashionStore</Text>
          <Text style={styles.title}>Create your account</Text>

          {/* NAME */}
          <TextInput
            placeholder="Name"
            placeholderTextColor="#777"
            style={styles.input}
            value={name}
            onChangeText={setName}
          />
          {nameError && <Text style={styles.error}>{nameError}</Text>}

          {/* EMAIL */}
          <TextInput
            placeholder="Email"
            placeholderTextColor="#777"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
          />
          {emailError && <Text style={styles.error}>{emailError}</Text>}

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
          {passwordError && <Text style={styles.error}>{passwordError}</Text>}

          {/* CONFIRM PASSWORD */}
          <View style={styles.passwordWrapper}>
            <TextInput
              placeholder="Confirm Password"
              placeholderTextColor="#777"
              style={styles.passwordInput}
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <Pressable onPress={() => setShowConfirm(!showConfirm)}>
              <Ionicons
                name={showConfirm ? 'eye-off-outline' : 'eye-outline'}
                size={22}
                color="#777"
              />
            </Pressable>
          </View>
          {confirmError && <Text style={styles.error}>{confirmError}</Text>}

          {serverError && <Text style={styles.errorCenter}>{serverError}</Text>}

          {successMessage ? (
            <>
              <Text style={styles.success}>{successMessage}</Text>
              <Pressable style={styles.button} onPress={() => router.replace('/login')}>
                <Text style={styles.buttonText}>Go to Login</Text>
              </Pressable>
            </>
          ) : (
            <Pressable style={styles.button} onPress={handleRegister}>
              <Text style={styles.buttonText}>Register</Text>
            </Pressable>
          )}

          {!successMessage && (
            <Text style={styles.link} onPress={() => router.replace('/login')}>
              Already have an account? Login
            </Text>
          )}
        </View>
      </View>
    </UserLayout>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 80,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0f0f0f',
    borderRadius: 18,
    padding: 24,
  },
  logo: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  title: {
    color: '#999',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 18,
  },
  input: {
    backgroundColor: '#111',
    color: '#fff',
    borderRadius: 10,
    paddingVertical: 9,
    paddingHorizontal: 14,
    fontSize: 14,
    marginBottom: 6,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
  },
  passwordInput: {
    flex: 1,
    color: '#fff',
    paddingVertical: 9,
    fontSize: 14,
  },
  error: {
    color: '#ff4d4d',
    fontSize: 12,
    marginBottom: 6,
  },
  errorCenter: {
    color: '#ff4d4d',
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 6,
  },
  success: {
    color: '#4CAF50',
    fontSize: 13,
    textAlign: 'center',
    marginVertical: 8,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 8,
  },
  buttonText: {
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
  link: {
    color: '#777',
    textAlign: 'center',
    marginTop: 14,
    fontSize: 13,
  },
});
