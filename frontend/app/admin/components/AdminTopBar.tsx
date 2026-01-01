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
  },
  hello: {
    fontSize: 20,
    fontWeight: '600',
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#f4f4f4',
    paddingHorizontal: 12,
    borderRadius: 10,
    width: 250,
  },
  email: {
  fontSize: 14,
  color: '#777',
}

});
