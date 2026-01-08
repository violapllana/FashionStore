import { View, Text, StyleSheet, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function AdminTopBar({ name, email }: any) {
  return (
    <View style={styles.top}>
      <View>
        <Text style={styles.hello}>Hello, {name} 👋</Text>
        <Text style={styles.email}>{email}</Text>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  top: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    backgroundColor: '#fff', // <- shto këtë për të bërë të bardhë
    padding: 15,
    borderRadius: 10,
  },
  hello: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111', // mbaj të zi për tekst
  },
  email: {
    fontSize: 14,
    color: '#555',
  },
});
