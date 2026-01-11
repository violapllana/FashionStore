import { View, Text, Pressable, StyleSheet, useWindowDimensions } from "react-native";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Props {
  role: string | null;
  favoritesCount: number;
  cartCount: number;
  ordersCount: number;
  onMenuPress: () => void;
  setRole?: (v: string | null) => void;
  setCart?: (v: any[]) => void;
  setFavorites?: (v: any[]) => void;
  setOrders?: (v: any[]) => void;
}

export default function TopBar({
  role,
  favoritesCount,
  cartCount,
  ordersCount,
  onMenuPress,
  setRole,
  setCart,
  setFavorites,
  setOrders,
}: Props) {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768; 

  const handleLogout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("role");

    setRole && setRole(null);
    setCart && setCart([]);
    setFavorites && setFavorites([]);
    setOrders && setOrders([]);

    router.push("/");
  };

  return (
    <View style={styles.topBar}>
      {/* MENU ICON */}
      <Pressable onPress={onMenuPress}>
        <Text style={styles.menuIcon}>☰</Text>
      </Pressable>

      {/* LOGO */}
      <Pressable onPress={() => router.push("/")}>
        <Text style={styles.title}>FashionStore</Text>
      </Pressable>

      {/* RIGHT ACTIONS */}
      <View style={styles.right}>
        {!isMobile && role && (
          <>
            <Pressable onPress={() => router.push("/user/productsList")}>
              <Text style={styles.icon}>Products</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/user/favorite")}>
              <Text style={styles.icon}>Favorite ({favoritesCount})</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/user/cart")}>
              <Text style={styles.icon}>Cart ({cartCount})</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/user/orders")}>
              <Text style={styles.icon}>Orders ({ordersCount})</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/user/contact")}>
              <Text style={styles.icon}>Contact</Text>
            </Pressable>
            <Pressable onPress={() => router.push("/user/Profile")}>
              <Text style={styles.icon}>Profile</Text>
            </Pressable>
          </>
        )}

        {role ? (
          <Pressable onPress={handleLogout} style={styles.btn}>
            <Text style={styles.btnText}>Logout</Text>
          </Pressable>
        ) : (
          <>
            <Pressable
              onPress={() => router.push("/login")}
              style={styles.btn}
            >
              <Text style={styles.btnText}>Login</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/register")}
              style={[styles.btn, styles.registerBtn]}
            >
              <Text style={styles.btnText}>Register</Text>
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    height: 60,
    backgroundColor: "#000",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    justifyContent: "space-between",
  },
  menuIcon: {
    color: "#fff",
    fontSize: 28,
    marginRight: 10,
  },
  title: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    color: "#fff",
    marginRight: 10,
    fontSize: 14,
  },
  btn: {
    backgroundColor: "#000",
    paddingVertical: 7,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginLeft: 6,
    borderWidth: 1,
    borderColor: "#fff",
  },
  registerBtn: {
    backgroundColor: "#ff4d6d",
    borderColor: "#ff4d6d",
  },
  btnText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 13,
  },
});



