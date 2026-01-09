// import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
// import { useEffect, useState } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import axios from "axios";
// import UserLayout from "./components/UserLayout";

// interface FavoriteItem {
//   id: number;
//   Product: {
//     id: number;
//     name: string;
//     price: number;
//     image: string;
//   };
// }

// export default function Favorites() {
//   const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
//   const [role, setRole] = useState<string | null>(null);

//   const fetchFavorites = async () => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       const res = await axios.get("http://localhost:5000/api/favorites", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setFavorites(res.data);
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Cannot fetch favorites");
//     }
//   };

//   const removeFavorite = async (productId: number) => {
//     try {
//       const token = await AsyncStorage.getItem("token");
//       await axios.delete(`http://localhost:5000/api/favorites/${productId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       fetchFavorites();
//     } catch (err) {
//       console.log(err);
//       Alert.alert("Error", "Cannot remove favorite");
//     }
//   };

//   useEffect(() => {
//     AsyncStorage.getItem("role").then(setRole);
//     fetchFavorites();
//   }, []);

//   const handleLogout = async () => { await AsyncStorage.clear(); setRole(null); };

//   return (
//     <UserLayout
//       role={role}
//       favorites={favorites}
//       searchQuery=""
//       setSearchQuery={() => {}}
//       onLogout={handleLogout}
//       onRemoveFavorite={removeFavorite}
//       cart={[]}
//       orders={[]}
//       onChangeQty={() => {}}
//       onOrder={() => {}}
//     >
//       <ScrollView style={styles.container}>
//         <Text style={styles.title}>My Favorites ❤️ </Text>
//         {favorites.length === 0 ? (
//           <Text style={{ padding: 20 }}>No favorite products</Text>
//         ) : (
//           favorites.map((item) => (
//             <View key={item.id} style={styles.item}>
//               <Text style={styles.name}>{item.Product.name}</Text>
//               <Text>Price: ${item.Product.price}</Text>
//               <Pressable style={styles.btn} onPress={() => removeFavorite(item.Product.id)}>
//                 <Text style={styles.btnText}>Remove</Text>
//               </Pressable>
//             </View>
//           ))
//         )}
//       </ScrollView>
//     </UserLayout>
//   );
// }

// const styles = StyleSheet.create({
//   container: { flex: 1, backgroundColor: "#fff", padding: 20 },
//   title: { fontSize: 28, fontWeight: "700", marginBottom: 20 },
//   item: { marginBottom: 15, padding: 15, backgroundColor: "#f5f5f5", borderRadius: 12 },
//   name: { fontSize: 18, fontWeight: "600", marginBottom: 5 },
//   btn: { backgroundColor: "#1f1f1f", padding: 10, borderRadius: 8, marginTop: 8 },
//   btnText: { color: "#fff", textAlign: "center", fontWeight: "700" },
// });
import { View, Text, ScrollView, Pressable, StyleSheet, Alert } from "react-native";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import UserLayout from "./components/UserLayout";

interface FavoriteItem {
  id: number;
  Product: {
    id: number;
    name: string;
    price: number;
    image?: string;
  };
}

export default function Favorites() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [role, setRole] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(res.data);
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot fetch favorites");
    }
  };

  const removeFavorite = async (productId: number) => {
    try {
      const token = await AsyncStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/favorites/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFavorites();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "Cannot remove favorite");
    }
  };

  useEffect(() => {
    AsyncStorage.getItem("role").then(setRole);
    fetchFavorites();
  }, []);

  const handleLogout = async () => { await AsyncStorage.clear(); setRole(null); };

  return (
    <UserLayout
      role={role}
      favorites={favorites}
      searchQuery=""
      setSearchQuery={() => {}}
      onLogout={handleLogout}
      onRemoveFavorite={removeFavorite}
      cart={[]}
      orders={[]}
      onChangeQty={() => {}}
      onOrder={() => {}}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.pageTitle}>My Favorites ❤️</Text>

        {favorites.length === 0 ? (
          <Text style={styles.emptyMsg}>No favorite products yet</Text>
        ) : (
          favorites.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <Text style={styles.productName}>{item.Product.name}</Text>
                <Text style={styles.price}>€{item.Product.price}</Text>
              </View>

              <View style={styles.divider} />

              <Pressable style={styles.deleteBtn} onPress={() => removeFavorite(item.Product.id)}>
                <Text style={styles.deleteText}>Remove</Text>
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

  divider: { height: 1, backgroundColor: "#eee", marginVertical: 12 },

  deleteBtn: { backgroundColor: "#000", paddingVertical: 14, borderRadius: 10, alignItems: "center" },
  deleteText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
