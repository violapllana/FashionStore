import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";

interface Props {
  visible: boolean;
  onClose: () => void;
  cart: any[];
  favorites: any[];
  orders: any[];
  changeCartQuantity?: (item: any, delta: number) => void;
  removeFromFavorites?: (id: number) => void;
  placeOrder?: () => void;
}

export default function ShopSidebar({
  visible,
  onClose,
  cart,
  favorites,
  orders,
  changeCartQuantity,
  removeFromFavorites,
  placeOrder,
}: Props) {
  const router = useRouter();
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebar}>
        <Pressable onPress={() => router.push("/")}>
          <Text style={styles.logo}>FashionStore</Text>
        </Pressable>

        <Pressable
          style={styles.profileBtn}
          onPress={() => {
            onClose();
            router.push("/user/Profile");
          }}
        >
          <Text style={styles.profileText}>👤 My Profile</Text>
        </Pressable>

        <Text style={styles.section}>Favorites ({favorites.length})</Text>
        {favorites.map((f) => (
          <View key={f.id} style={styles.item}>
            <Text style={{ flex: 1 }}>{f.Product?.name || f.name}</Text>
            {removeFromFavorites && (
              <Pressable
                onPress={() => removeFromFavorites(f.Product?.id || f.id)}
              >
                <Text style={styles.remove}>✕</Text>
              </Pressable>
            )}
          </View>
        ))}

        <Text style={styles.section}>Cart ({cart.length})</Text>
        {cart.map((c) => (
          <View key={c.id} style={styles.item}>
            <Text style={{ flex: 1 }}>{c.Product?.name || c.name}</Text>
            {changeCartQuantity && (
              <View style={{ flexDirection: "row" }}>
                <Pressable onPress={() => changeCartQuantity(c, -1)}>
                  <Text style={styles.qty}>-</Text>
                </Pressable>
                <Text>{c.quantity}</Text>
                <Pressable onPress={() => changeCartQuantity(c, 1)}>
                  <Text style={styles.qty}>+</Text>
                </Pressable>
              </View>
            )}
          </View>
        ))}

        {cart.length > 0 && placeOrder && (
          <Pressable style={styles.orderBtn} onPress={placeOrder}>
            <Text style={{ color: "#fff" }}>Place Order</Text>
          </Pressable>
        )}

        <Pressable style={styles.closeBtn} onPress={onClose}>
          <Text style={{ color: "#fff" }}>Close</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  sidebar: {
    width: "70%",
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
  },
  logo: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  section: { fontWeight: "700", marginTop: 15 },
  item: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  remove: { color: "red", marginLeft: 10 },
  qty: { marginHorizontal: 8, fontSize: 18 },
  orderBtn: {
    backgroundColor: "#1e90ff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  closeBtn: {
    marginTop: 20,
    backgroundColor: "#000",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  profileBtn: {
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 10,
  },
  profileText: { fontWeight: "700" },
});
