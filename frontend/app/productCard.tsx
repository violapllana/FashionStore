import { View, Text, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const cardWidth = width / 4 - 10;

export default function ProductCard({ product, addToCart, addToFavorites }: any) {

  const imageUri =
    product.image?.startsWith("http")
      ? product.image
      : `http://localhost:5000/uploads/${product.image}`;

  return (
    <View style={[styles.card, { width: cardWidth }]}>

      {/* Favorite */}
      <Pressable style={styles.heart} onPress={() => addToFavorites(product)}>
        <AntDesign name="heart" size={16} color="#555" />
      </Pressable>

      {/* Image */}
      <View style={styles.imageBox}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="contain" />
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={1}>{product.name}</Text>

      {/* Price */}
      <Text style={styles.price}>${product.price}</Text>

      {/* Button */}
      <Pressable style={styles.cartBtn} onPress={() => addToCart(product)}>
        <Text style={styles.cartText}>Add to Cart</Text>
      </Pressable>

    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 8,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  heart: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#fff",
    width: 30,
    height: 30,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },

  imageBox: {
    height: 110,
    backgroundColor: "#f7f7f7",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  image: {
    width: "90%",
    height: "90%",
  },

  title: {
    fontSize: 13,
    fontWeight: "600",
    color: "#111",
    marginBottom: 4,
  },

  price: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
    marginBottom: 10,
  },

  cartBtn: {
    borderWidth: 1,
    borderColor: "#aaa",
    borderRadius: 25,
    paddingVertical: 6,
    alignItems: "center",
  },

  cartText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
});
