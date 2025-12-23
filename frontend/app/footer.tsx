import { View, Text, StyleSheet, Linking, Pressable, ScrollView } from 'react-native';
import WeatherWidget from './user/weather';
import { router } from 'expo-router';

export default function Footer() {
  return (
    <View style={styles.footer}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ alignItems: 'flex-start' }}>
        {/* WEATHER */}
        <View style={styles.column}>
          <Text style={styles.heading}>Weather</Text>
          <WeatherWidget />
        </View>

        {/* CONTACT */}
        <View style={styles.column}>
          <Text style={styles.heading}>Contact</Text>
          <Text style={styles.text}>contact@fashionstore.com</Text>
          <Text style={styles.text}>+383 38 616 161</Text>
          <Text style={styles.text}>+383 46 470 047 (Viber / WhatsApp)</Text>
          <Text style={styles.text}>Magjistralja Prishtinë–Ferizaj, Lapnasellë, Prishtinë, Kosovo</Text>
        </View>

        {/* QUICK LINKS */}
        <View style={styles.column}>
          <Text style={styles.heading}>Quick Links</Text>
       <Pressable onPress={() => router.push('/user/cart')}>
          <Text style={styles.link}>Cart</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/user/orders')}>
          <Text style={styles.link}>Orders</Text>
        </Pressable>
        <Pressable onPress={() => router.push('/user/favorite')}>
          <Text style={styles.link}>Favorite</Text>
        </Pressable>
            <Pressable onPress={() => router.push('/productCard')}>
          <Text style={styles.link}>Products</Text>
        </Pressable>
        </View>
      </ScrollView>
      <Text style={styles.copyright}>© 2025 FashionStore. All rights reserved.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    backgroundColor: '#111',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  column: {
    marginRight: 24,
  },
  heading: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 12,
    color: '#fff',
  },
  text: {
    fontSize: 14,
    marginBottom: 6,
    color: '#ccc',
  },
  link: {
    fontSize: 14,
    color: '#1e90ff',
    marginBottom: 6,
  },
  copyright: {
    marginTop: 16,
    textAlign: 'center',
    fontSize: 12,
    color: '#888',
  },
});
