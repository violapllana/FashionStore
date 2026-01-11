import { View, ScrollView, Pressable, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

interface Props {
  visible: boolean;
  favorites: any[];
  cart: any[];
  orders: any[];
  onClose: () => void;
  onRemoveFavorite: (id: number) => void;
  onRemoveFromCart: (id: number) => void;
  onChangeQty: (item: any, delta: number) => void;
  onOrder: (item?: any) => void;
}

export default function UserSidebar({
  visible,
  favorites,
  cart,
  orders,
  onClose,
  onRemoveFavorite,
  onRemoveFromCart,
  onChangeQty,
  onOrder,
}: Props) {
  const router = useRouter();
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebar}>
        <Pressable style={styles.closeBtnTop} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <ScrollView style={{ marginTop: 10 }}>
          {/* Logo */}
          <Pressable onPress={() => router.push("/")}>
            <Text style={styles.logo}>FashionStore</Text>
          </Pressable>

          {/* Profile / Links */}
          <Pressable style={styles.profileBtn} onPress={() => router.push("/user/Profile")}>
            <Text style={styles.profileText}>👤 My Profile</Text>
          </Pressable>
          <Pressable style={styles.profileBtn} onPress={() => router.push("/user/contact")}>
            <Text style={styles.profileText}>📩 Contact Us</Text>
          </Pressable>
          <Pressable style={styles.profileBtn} onPress={() => router.push("/user/productsList")}>
            <Text style={styles.profileText}>🛍️ Products List</Text>
          </Pressable>

          {/* Favorites */}
          <Text style={styles.sidebarTitle}>Favorites</Text>
          {favorites.length === 0 ? (
            <Text>No favorites yet.</Text>
          ) : (
            favorites.map((p) => (
              <View key={p.id} style={styles.cartItem}>
                <Text style={{ flex: 1 }}>{p.Product?.name || p.name}</Text>
                <Pressable style={styles.removeBtn} onPress={() => onRemoveFavorite(p.Product?.id || p.id)}>
                  <Text style={{ color: "#fff" }}>Remove</Text>
                </Pressable>
              </View>
            ))
          )}

          {/* Cart */}
          <Text style={styles.sidebarTitle}>Cart</Text>
          {cart.length === 0 ? (
            <Text>Cart is empty.</Text>
          ) : (
            cart.map((p) => (
              <View key={p.id} style={styles.cartItem}>
                <Text style={{ flex: 1 }}>{p.Product?.name || p.name}</Text>

                <View style={styles.quantityControls}>
                  <Pressable
                    style={styles.qtyBtn}
                    onPress={() => (p.quantity <= 1 ? onRemoveFromCart(p.id) : onChangeQty(p, -1))}
                  >
                    <Text>-</Text>
                  </Pressable>
                  <Text style={styles.qtyText}>{p.quantity}</Text>
                  <Pressable style={styles.qtyBtn} onPress={() => onChangeQty(p, 1)}>
                    <Text>+</Text>
                  </Pressable>
                </View>

                <Pressable style={styles.removeBtn} onPress={() => onRemoveFromCart(p.id)}>
                  <Text style={{ color: "#fff" }}>Remove</Text>
                </Pressable>

                <Pressable style={[styles.orderBtn, { paddingVertical: 4, paddingHorizontal: 8 }]} onPress={() => onOrder(p)}>
                  <Text style={styles.orderText}>Order</Text>
                </Pressable>
              </View>
            ))
          )}

          {cart.length > 0 && (
            <Pressable style={styles.orderBtn} onPress={() => onOrder()}>
              <Text style={styles.orderText}>Place All Orders</Text>
            </Pressable>
          )}

          {/* Orders */}
          <Text style={styles.sidebarTitle}>Orders</Text>
          {orders.length === 0 ? (
            <Text>No orders yet.</Text>
          ) : (
            orders.map((o) => (
              <View key={o.id} style={styles.orderItem}>
                <Text style={{ fontWeight: "600" }}>Order #{o.id}</Text>
                {o.items?.map((i: any) => (
                  <Text key={i.id}>
                    {i.Product?.name} x {i.quantity}
                  </Text>
                ))}
              </View>
            ))
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: { position: "absolute", width: "100%", height: "100%", backgroundColor: "rgba(0,0,0,0.3)", zIndex: 10 },
  sidebar: { width: "60%", height: "100%", backgroundColor: "#fff", padding: 20 },
  closeBtnTop: { position: "absolute", top: 15, right: 15, zIndex: 20, backgroundColor: "#000", padding: 8, borderRadius: 20 },
  closeText: { color: "#fff", fontWeight: "700", fontSize: 16, textAlign: "center" },
  logo: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  profileBtn: { paddingVertical: 10, paddingHorizontal: 15, backgroundColor: "#f2f2f2", borderRadius: 10, marginBottom: 12 },
  profileText: { fontSize: 15, fontWeight: "700", color: "#111" },
  sidebarTitle: { fontSize: 16, fontWeight: "700", marginTop: 15, marginBottom: 5 },
  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 8, flexWrap: "wrap" },
  quantityControls: { flexDirection: "row", alignItems: "center", marginHorizontal: 5 },
  qtyBtn: { padding: 5, backgroundColor: "#ccc", borderRadius: 5 },
  qtyText: { marginHorizontal: 5 },
  removeBtn: { padding: 5, backgroundColor: "#ff4d6d", borderRadius: 5, marginLeft: 5 },
  orderBtn: { padding: 8, backgroundColor: "#1e90ff", borderRadius: 8, marginVertical: 10 },
  orderText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  orderItem: { padding: 8, marginBottom: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 },
});
