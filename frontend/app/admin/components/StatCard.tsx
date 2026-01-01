import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ title, value, color }: any) {
  return (
    <View style={[styles.card, { borderLeftColor: color }]}>
     <Text style={styles.value}>{value}</Text>

      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 15,
    borderLeftWidth: 5,
    marginBottom: 15,
    elevation: 2,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
  },
  title: {
    marginTop: 6,
    color: '#777',
  },
});
