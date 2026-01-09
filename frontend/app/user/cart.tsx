// import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import UserLayout from "./components/UserLayout";

// interface CartItem {
//   id: number;
//   quantity: number;
//   Product: {
//     id: number;
//     name: string;
//     price: number;
//     image?: string;
//   };
// }

// export default function Cart() {
//   const [cart, setCart] = useState<CartItem[]>([]);
//   const [role, setRole] = useState<string | null>(null);
//   const [loading, setLoading] = useState(false);

//   const fetchCart = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;
//       const res = await axios.get("http://localhost:5000/api/cart", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setCart(res.data);
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Cannot fetch cart");
//     }
//   };

//   const removeItem = async (id: number) => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;
//       await axios.delete(`http://localhost:5000/api/cart/${id}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchCart();
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Cannot remove item");
//     }
//   };

//   const changeQty = async (item: CartItem, delta: number) => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;

//       const newQty = item.quantity + delta;
//       if (newQty < 1) return removeItem(item.id);

//       await axios.put(
//         `http://localhost:5000/api/cart/${item.id}`,
//         { quantity: newQty },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       fetchCart();
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Cannot update quantity");
//     }
//   };

//   const placeOrder = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       if (!token) return;
//       await axios.post(
//         "http://localhost:5000/api/orders",
//         { items: cart },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       Alert.alert("Success", "Order placed!");
//       setCart([]);
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Cannot place order");
//     }
//   };

//   useEffect(() => {
//     AsyncStorage.getItem("role").then(setRole);
//     fetchCart();
//   }, []);

//   const handleLogout = async () => {
//     await AsyncStorage.clear();
//     setRole(null);
//   };

//   return (
//     <UserLayout
//       role={role}
//       cart={cart}
//       favorites={[]}
//       orders={[]}
//       searchQuery=""
//       setSearchQuery={() => {}}
//       onLogout={handleLogout}
//       onRemoveFavorite={() => {}}
//       onChangeQty={changeQty}
//       onOrder={placeOrder}
//     >
//       <ScrollView style={styles.container}>
//         <Text style={styles.title}>My Cart 🛒</Text>
//         {cart.length === 0 ? (
//           <Text style={{ padding: 20 }}>Your cart is empty</Text>
//         ) : (
//           cart.map((item) => (
//             <View key={item.id} style={styles.cartItem}>
//               <Text style={{ flex: 1, fontSize: 16 }}>{item.Product.name}</Text>

//               {/* Quantity Controls */}
//               <View style={styles.quantityControls}>
//                 <Pressable style={styles.qtyBtn} onPress={() => changeQty(item, -1)}>
//                   <Text>-</Text>
//                 </Pressable>
//                 <Text style={styles.qtyText}>{item.quantity}</Text>
//                 <Pressable style={styles.qtyBtn} onPress={() => changeQty(item, 1)}>
//                   <Text>+</Text>
//                 </Pressable>
//               </View>

//               {/* Remove Button */}
//               <Pressable style={styles.removeBtn} onPress={() => removeItem(item.id)}>
//                 <Text style={styles.removeText}>Remove</Text>
//               </Pressable>
//             </View>
//           ))
//         )}

//         {/* Place Order Button */}
//         {cart.length > 0 && (
//           <Pressable style={styles.orderBtn} onPress={placeOrder}>
//             <Text style={styles.orderText}>Place Order</Text>
//           </Pressable>
//         )}
//       </ScrollView>
//     </UserLayout>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 20 },
//   title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
//   cartItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 15,
//     backgroundColor: "#f5f5f5",
//     borderRadius: 12,
//     marginBottom: 10,
//   },
//   quantityControls: {
//     flexDirection: "row",
//     alignItems: "center",
//     marginHorizontal: 10,
//   },
//   qtyBtn: {
//     width: 28,
//     height: 28,
//     borderRadius: 6,
//     backgroundColor: "#ddd",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   qtyText: { marginHorizontal: 8, fontSize: 16 },
//   removeBtn: {
//     backgroundColor: "#ff4d6d",
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 8,
//   },
//   removeText: { color: "#fff", fontWeight: "700" },
//   orderBtn: {
//     backgroundColor: "#000",
//     paddingVertical: 14,
//     borderRadius: 10,
//     alignItems: "center",
//     marginTop: 20,
//   },
//   orderText: { color: "#fff", fontWeight: "700", fontSize: 16 },
// });
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import UserLayout from "./components/UserLayout";

interface CartItem {
  id: number;
  quantity: number;
  Product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
}

export default function Cart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [role, setRole] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      const res = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot fetch cart");
    }
  };

  const removeItem = async (id: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      await axios.delete(`http://localhost:5000/api/cart/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot remove item");
    }
  };

  const changeQty = async (item: CartItem, delta: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;

      const newQty = item.quantity + delta;
      if (newQty < 1) return removeItem(item.id);

      await axios.put(
        `http://localhost:5000/api/cart/${item.id}`,
        { quantity: newQty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchCart();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot update quantity");
    }
  };

  const placeOrder = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) return;
      await axios.post(
        "http://localhost:5000/api/orders",
        { items: cart },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert("Success", "Order placed!");
      setCart([]);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot place order");
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("role").then(setRole);
    fetchCart();
  }, []);

  const handleLogout = async () => {
    await AsyncStorage.clear();
    setRole(null);
  };

  return (
    <UserLayout
      role={role}
      cart={cart}
      favorites={[]}
      orders={[]}
      searchQuery=""
      setSearchQuery={() => {}}
      onLogout={handleLogout}
      onRemoveFavorite={() => {}}
      onChangeQty={changeQty}
      onOrder={placeOrder}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>My Cart 🛒</Text>

        {cart.length === 0 ? (
          <Text style={styles.emptyMsg}>Your cart is empty</Text>
        ) : (
          cart.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.productName}>{item.Product.name}</Text>
                <Text style={styles.price}>€{item.Product.price}</Text>
              </View>

              <View style={styles.itemRow}>
                <Text style={styles.qtyLabel}>Quantity:</Text>
                <View style={styles.quantityControls}>
                  <Pressable style={styles.qtyBtn} onPress={() => changeQty(item, -1)}>
                    <Text>-</Text>
                  </Pressable>
                  <Text style={styles.qtyText}>{item.quantity}</Text>
                  <Pressable style={styles.qtyBtn} onPress={() => changeQty(item, 1)}>
                    <Text>+</Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.divider} />

              <Pressable style={styles.orderBtn} onPress={placeOrder}>
                <Text style={styles.orderText}>Place Order</Text>
              </Pressable>
            </View>
          ))
        )}
      </ScrollView>
    </UserLayout>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: "#f6f6f6", padding: 16 },
  pageTitle: { fontSize: 26, fontWeight: "700", marginBottom: 16 },
  emptyMsg: { fontSize: 16, color: "#777", textAlign: "center", marginTop: 40 },

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  productName: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 14, color: "#555" },

  itemRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginVertical: 10 },
  qtyLabel: { fontSize: 14, fontWeight: "600" },
  quantityControls: { flexDirection: "row", alignItems: "center" },
  qtyBtn: { width: 28, height: 28, borderRadius: 6, backgroundColor: "#ddd", alignItems: "center", justifyContent: "center" },
  qtyText: { marginHorizontal: 8, fontSize: 16 },

  divider: { height: 1, backgroundColor: "#eee", marginVertical: 12 },

  orderBtn: { backgroundColor: "#000", paddingVertical: 14, borderRadius: 10, alignItems: "center", marginTop: 10 },
  orderText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
