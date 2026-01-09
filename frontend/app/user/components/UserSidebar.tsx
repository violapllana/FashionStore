// import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
// import { useRouter } from "expo-router";

// interface Props {
//   visible: boolean;
//   favorites: any[];
//   cart: any[];
//   orders: any[];
//   onClose: () => void;
//   onRemoveFavorite: (id: number) => void;
//   onChangeQty: (item: any, delta: number) => void;
//   onOrder: () => void;
// }

// export default function UserSidebar({
//   visible,
//   favorites,
//   cart,
//   orders,
//   onClose,
//   onRemoveFavorite,
//   onChangeQty,
//   onOrder,
// }: Props) {
//   const router = useRouter();
//   if (!visible) return null;

//   return (
//     <View style={styles.overlay}>
//       <ScrollView style={styles.sidebar}>
//         {/* LOGO */}
//         <Pressable onPress={() => router.push("/")}>
//           <Text style={styles.logo}>FashionStore</Text>
//         </Pressable>

//         {/* Profile */}
//         <Pressable
//           style={styles.profileBtn}
//           onPress={() => router.push("/user/Profile")}
//         >
//           <Text style={styles.profileText}>👤 My Profile</Text>
//         </Pressable>

//         {/* Contact */}
//         <Pressable
//           style={styles.profileBtn}
//           onPress={() => router.push("/user/contact")}
//         >
//           <Text style={styles.profileText}>📩 Contact Us</Text>
//         </Pressable>

//         {/* Favorites */}
//         <Text style={styles.sidebarTitle}>Favorites ({favorites.length})</Text>
//         {favorites.length === 0 ? (
//           <Text>No favorites yet.</Text>
//         ) : (
//           favorites.map((p) => (
//             <View key={p.id} style={styles.cartItem}>
//               <Text style={{ flex: 1 }}>{p.Product?.name || p.name}</Text>
//               <Pressable
//                 style={styles.removeBtn}
//                 onPress={() => onRemoveFavorite(p.Product?.id || p.id)}
//               >
//                 <Text style={{ color: "#fff" }}>Remove</Text>
//               </Pressable>
//             </View>
//           ))
//         )}

//         {/* Cart */}
//         <Text style={styles.sidebarTitle}>Cart ({cart.length})</Text>
//         {cart.length === 0 ? (
//           <Text>Cart is empty.</Text>
//         ) : (
//           cart.map((p) => (
//             <View key={p.id} style={styles.cartItem}>
//               <Text style={{ flex: 1 }}>{p.Product?.name || p.name}</Text>
//               <View style={styles.quantityControls}>
//                 <Pressable
//                   style={styles.qtyBtn}
//                   onPress={() => onChangeQty(p, -1)}
//                 >
//                   <Text>-</Text>
//                 </Pressable>
//                 <Text style={styles.qtyText}>{p.quantity}</Text>
//                 <Pressable
//                   style={styles.qtyBtn}
//                   onPress={() => onChangeQty(p, 1)}
//                 >
//                   <Text>+</Text>
//                 </Pressable>
//               </View>
//             </View>
//           ))
//         )}
//         {cart.length > 0 && (
//           <Pressable style={styles.orderBtn} onPress={onOrder}>
//             <Text style={styles.orderText}>Place Order</Text>
//           </Pressable>
//         )}

//         {/* Orders */}
//         <Text style={styles.sidebarTitle}>Orders ({orders.length})</Text>
//         {orders.length === 0 ? (
//           <Text>No orders yet.</Text>
//         ) : (
//           orders.map((o) => (
//             <View key={o.id} style={styles.orderItem}>
//               <Text style={{ fontWeight: "600" }}>Order #{o.id}</Text>
//               {o.items?.map((i: any) => (
//                 <Text key={i.id}>
//                   {i.Product?.name} x {i.quantity}
//                 </Text>
//               ))}
//             </View>
//           ))
//         )}

//         {/* Close Sidebar */}
//         <Pressable style={styles.closeBtn} onPress={onClose}>
//           <Text style={styles.closeText}>Close</Text>
//         </Pressable>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.3)",
//     zIndex: 10,
//   },
//   sidebar: {
//     width: "75%",
//     height: "100%",
//     backgroundColor: "#fff",
//     padding: 25,
//   },
//   logo: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
//   profileBtn: {
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     backgroundColor: "#f2f2f2",
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   profileText: { fontSize: 16, fontWeight: "700", color: "#111" },
//   sidebarTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginTop: 15,
//     marginBottom: 5,
//   },
//   cartItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   quantityControls: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   qtyBtn: {
//     padding: 5,
//     backgroundColor: "#ccc",
//     borderRadius: 5,
//   },
//   qtyText: { marginHorizontal: 5 },
//   removeBtn: {
//     padding: 5,
//     backgroundColor: "#ff4d6d",
//     borderRadius: 5,
//     marginLeft: 5,
//   },
//   orderBtn: {
//     padding: 10,
//     backgroundColor: "#1e90ff",
//     borderRadius: 8,
//     marginVertical: 10,
//   },
//   orderText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "700",
//   },
//   orderItem: {
//     padding: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//   },
//   closeBtn: {
//     marginTop: 20,
//     padding: 12,
//     backgroundColor: "#000",
//     borderRadius: 10,
//   },
//   closeText: { color: "#fff", textAlign: "center", fontWeight: "700" },
// });
// import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
// import { useRouter } from "expo-router";

// interface Props {
//   visible: boolean;
//   favorites: any[];
//   cart: any[];
//   orders: any[];
//   onClose: () => void;
//   onRemoveFavorite: (id: number) => void;
//   onChangeQty: (item: any, delta: number) => void;
//   onOrder: () => void;
// }

// export default function UserSidebar({
//   visible,
//   favorites,
//   cart,
//   orders,
//   onClose,
//   onRemoveFavorite,
//   onChangeQty,
//   onOrder,
// }: Props) {
//   const router = useRouter();
//   if (!visible) return null;

//   return (
//     <View style={styles.overlay}>
//       <ScrollView style={styles.sidebar}>
//         {/* LOGO */}
//         <Pressable onPress={() => router.push("/")}>
//           <Text style={styles.logo}>FashionStore</Text>
//         </Pressable>

//         {/* TOP BUTTONS */}
//         <View style={styles.topButtons}>
//           <Pressable
//             style={styles.topBtn}
//             onPress={() => router.push("/user/favorite")}
//           >
//             <Text style={styles.topBtnText}>♥ {favorites.length}</Text>
//           </Pressable>
//           <Pressable
//             style={styles.topBtn}
//             onPress={() => router.push("/user/cart")}
//           >
//             <Text style={styles.topBtnText}>🛒 {cart.length}</Text>
//           </Pressable>
//           <Pressable
//             style={styles.topBtn}
//             onPress={() => router.push("/user/orders")}
//           >
//             <Text style={styles.topBtnText}>📦 {orders.length}</Text>
//           </Pressable>
//         </View>

//         {/* Profile */}
//         <Pressable
//           style={styles.profileBtn}
//           onPress={() => router.push("/user/Profile")}
//         >
//           <Text style={styles.profileText}>👤 My Profile</Text>
//         </Pressable>

//         {/* Contact */}
//         <Pressable
//           style={styles.profileBtn}
//           onPress={() => router.push("/user/contact")}
//         >
//           <Text style={styles.profileText}>📩 Contact Us</Text>
//         </Pressable>

//         {/* Favorites */}
//         <Text style={styles.sidebarTitle}>Favorites</Text>
//         {favorites.length === 0 ? (
//           <Text>No favorites yet.</Text>
//         ) : (
//           favorites.map((p) => (
//             <View key={p.id} style={styles.cartItem}>
//               <Text style={{ flex: 1 }}>{p.Product?.name || p.name}</Text>
//               <Pressable
//                 style={styles.removeBtn}
//                 onPress={() => onRemoveFavorite(p.Product?.id || p.id)}
//               >
//                 <Text style={{ color: "#fff" }}>Remove</Text>
//               </Pressable>
//             </View>
//           ))
//         )}

//         {/* Cart */}
//         <Text style={styles.sidebarTitle}>Cart</Text>
//         {cart.length === 0 ? (
//           <Text>Cart is empty.</Text>
//         ) : (
//           cart.map((p) => (
//             <View key={p.id} style={styles.cartItem}>
//               <Text style={{ flex: 1 }}>{p.Product?.name || p.name}</Text>
//               <View style={styles.quantityControls}>
//                 <Pressable
//                   style={styles.qtyBtn}
//                   onPress={() => onChangeQty(p, -1)}
//                 >
//                   <Text>-</Text>
//                 </Pressable>
//                 <Text style={styles.qtyText}>{p.quantity}</Text>
//                 <Pressable
//                   style={styles.qtyBtn}
//                   onPress={() => onChangeQty(p, 1)}
//                 >
//                   <Text>+</Text>
//                 </Pressable>
//               </View>
//             </View>
//           ))
//         )}
//         {cart.length > 0 && (
//           <Pressable style={styles.orderBtn} onPress={onOrder}>
//             <Text style={styles.orderText}>Place Order</Text>
//           </Pressable>
//         )}

//         {/* Orders */}
//         <Text style={styles.sidebarTitle}>Orders</Text>
//         {orders.length === 0 ? (
//           <Text>No orders yet.</Text>
//         ) : (
//           orders.map((o) => (
//             <View key={o.id} style={styles.orderItem}>
//               <Text style={{ fontWeight: "600" }}>Order #{o.id}</Text>
//               {o.items?.map((i: any) => (
//                 <Text key={i.id}>
//                   {i.Product?.name} x {i.quantity}
//                 </Text>
//               ))}
//             </View>
//           ))
//         )}

//         {/* Close Sidebar */}
//         <Pressable style={styles.closeBtn} onPress={onClose}>
//           <Text style={styles.closeText}>Close</Text>
//         </Pressable>
//       </ScrollView>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   overlay: {
//     position: "absolute",
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0,0,0,0.3)",
//     zIndex: 10,
//   },
//   sidebar: {
//     width: "75%",
//     height: "100%",
//     backgroundColor: "#fff",
//     padding: 25,
//   },
//   logo: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
//   topButtons: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginVertical: 15,
//   },
//   topBtn: {
//     flex: 1,
//     marginHorizontal: 5,
//     paddingVertical: 10,
//     backgroundColor: "#000",
//     borderRadius: 10,
//   },
//   topBtnText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "700",
//   },
//   profileBtn: {
//     paddingVertical: 12,
//     paddingHorizontal: 15,
//     backgroundColor: "#f2f2f2",
//     borderRadius: 10,
//     marginBottom: 15,
//   },
//   profileText: { fontSize: 16, fontWeight: "700", color: "#111" },
//   sidebarTitle: {
//     fontSize: 18,
//     fontWeight: "700",
//     marginTop: 15,
//     marginBottom: 5,
//   },
//   cartItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   quantityControls: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 5,
//   },
//   qtyBtn: {
//     padding: 5,
//     backgroundColor: "#ccc",
//     borderRadius: 5,
//   },
//   qtyText: { marginHorizontal: 5 },
//   removeBtn: {
//     padding: 5,
//     backgroundColor: "#ff4d6d",
//     borderRadius: 5,
//     marginLeft: 5,
//   },
//   orderBtn: {
//     padding: 10,
//     backgroundColor: "#1e90ff",
//     borderRadius: 8,
//     marginVertical: 10,
//   },
//   orderText: {
//     color: "#fff",
//     textAlign: "center",
//     fontWeight: "700",
//   },
//   orderItem: {
//     padding: 8,
//     marginBottom: 8,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//   },
//   closeBtn: {
//     marginTop: 20,
//     padding: 12,
//     backgroundColor: "#000",
//     borderRadius: 10,
//   },
//   closeText: { color: "#fff", textAlign: "center", fontWeight: "700" },
// });
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";

interface Props {
  visible: boolean;
  favorites: any[];
  cart: any[];
  orders: any[];
  onClose: () => void;
  onRemoveFavorite: (id: number) => void;
  onChangeQty: (item: any, delta: number) => void;
  onOrder: () => void;
}

export default function UserSidebar({
  visible,
  favorites,
  cart,
  orders,
  onClose,
  onRemoveFavorite,
  onChangeQty,
  onOrder,
}: Props) {
  const router = useRouter();
  if (!visible) return null;

  return (
    <View style={styles.overlay}>
      <View style={styles.sidebar}>
        {/* Close Button Top */}
        <Pressable style={styles.closeBtnTop} onPress={onClose}>
          <Text style={styles.closeText}>✕</Text>
        </Pressable>

        <ScrollView style={{ marginTop: 10 }}>
          {/* LOGO */}
          <Pressable onPress={() => router.push("/")}>
            <Text style={styles.logo}>FashionStore</Text>
          </Pressable>

          {/* TOP BUTTONS */}
          <View style={styles.topButtons}>
            <Pressable
              style={styles.topBtn}
              onPress={() => router.push("/user/favorite")}
            >
              <Text style={styles.topBtnText}>♥ {favorites.length}</Text>
            </Pressable>
            <Pressable
              style={styles.topBtn}
              onPress={() => router.push("/user/cart")}
            >
              <Text style={styles.topBtnText}>🛒 {cart.length}</Text>
            </Pressable>
            <Pressable
              style={styles.topBtn}
              onPress={() => router.push("/user/orders")}
            >
              <Text style={styles.topBtnText}>📦 {orders.length}</Text>
            </Pressable>
          </View>

          {/* Profile */}
          <Pressable
            style={styles.profileBtn}
            onPress={() => router.push("/user/Profile")}
          >
            <Text style={styles.profileText}>👤 My Profile</Text>
          </Pressable>

          {/* Contact */}
          <Pressable
            style={styles.profileBtn}
            onPress={() => router.push("/user/contact")}
          >
            <Text style={styles.profileText}>📩 Contact Us</Text>
          </Pressable>

          {/* Favorites */}
          <Text style={styles.sidebarTitle}>Favorites</Text>
          {favorites.length === 0 ? (
            <Text>No favorites yet.</Text>
          ) : (
            favorites.map((p) => (
              <View key={p.id} style={styles.cartItem}>
                <Text style={{ flex: 1 }}>{p.Product?.name || p.name}</Text>
                <Pressable
                  style={styles.removeBtn}
                  onPress={() => onRemoveFavorite(p.Product?.id || p.id)}
                >
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
                  <Pressable style={styles.qtyBtn} onPress={() => onChangeQty(p, -1)}>
                    <Text>-</Text>
                  </Pressable>
                  <Text style={styles.qtyText}>{p.quantity}</Text>
                  <Pressable style={styles.qtyBtn} onPress={() => onChangeQty(p, 1)}>
                    <Text>+</Text>
                  </Pressable>
                </View>
              </View>
            ))
          )}
          {cart.length > 0 && (
            <Pressable style={styles.orderBtn} onPress={onOrder}>
              <Text style={styles.orderText}>Place Order</Text>
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
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.3)",
    zIndex: 10,
  },
  sidebar: {
    width: "60%", // më e ngushtë
    height: "100%",
    backgroundColor: "#fff",
    padding: 20,
  },
  closeBtnTop: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 20,
    backgroundColor: "#000",
    padding: 8,
    borderRadius: 20,
  },
  closeText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    textAlign: "center",
  },
  logo: { fontSize: 22, fontWeight: "700", marginBottom: 15 },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  topBtn: {
    flex: 1,
    marginHorizontal: 3,
    paddingVertical: 8,
    backgroundColor: "#000",
    borderRadius: 8,
  },
  topBtnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "700",
  },
  profileBtn: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f2f2f2",
    borderRadius: 10,
    marginBottom: 12,
  },
  profileText: { fontSize: 15, fontWeight: "700", color: "#111" },
  sidebarTitle: { fontSize: 16, fontWeight: "700", marginTop: 15, marginBottom: 5 },
  cartItem: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  quantityControls: { flexDirection: "row", alignItems: "center", marginHorizontal: 5 },
  qtyBtn: { padding: 5, backgroundColor: "#ccc", borderRadius: 5 },
  qtyText: { marginHorizontal: 5 },
  removeBtn: { padding: 5, backgroundColor: "#ff4d6d", borderRadius: 5, marginLeft: 5 },
  orderBtn: { padding: 8, backgroundColor: "#1e90ff", borderRadius: 8, marginVertical: 10 },
  orderText: { color: "#fff", textAlign: "center", fontWeight: "700" },
  orderItem: { padding: 8, marginBottom: 8, borderWidth: 1, borderColor: "#ccc", borderRadius: 8 },
});
