import { View, Text, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const cardWidth = width / 3 - 16; // 3 produkte për rresht me margin


interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image?: string;
}

interface ProductCardProps {
  product: Product;
  addToCart: (product: Product) => void;
  addToFavorites: (product: Product) => void;
}

export default function ProductCard(props: { product: any; addToCart: any; addToFavorites: any; }) {

  const { product, addToCart, addToFavorites } = props;
  return (
    <View style={[styles.card, { width: cardWidth }]}>
      
      {/* Favorite */}
      <Pressable style={styles.favorite} onPress={() => addToFavorites(product)}>
        <AntDesign name="heart" size={18} color="#333" />
      </Pressable>

      {/* Image */}
      <View style={styles.imageWrapper}>
        {product.image ? (
          <Image
            source={{ uri: `http://localhost:5000/uploads/${product.image}` }}
            style={styles.image}
            resizeMode="contain"
          />
        ) : (
          <Text>No Image</Text>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {product.name}
        </Text>

        <Text style={styles.description} numberOfLines={2}>
          {product.description}
        </Text>

        {/* Rating */}
        <View style={styles.rating}>
          {[...Array(5)].map((_, i) => (
            <AntDesign key={i} name="star" size={12} color="#22c55e" />
          ))}
          <Text style={styles.ratingText}>(121)</Text>
        </View>

        {/* Price + Button */}
        <View style={styles.bottom}>
          <Text style={styles.price}>${product.price}</Text>

          <Pressable style={styles.cartBtn} onPress={() => addToCart(product)}>
            <Text style={styles.cartText}>Add to Cart</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  favorite: {
    position: "absolute",
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 20,
    elevation: 2,
  },

  imageWrapper: {
    height: 100, // 🔥 më kompakte për fashion
    justifyContent: "center",
    alignItems: "center",
    padding: 6,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  info: {
    paddingHorizontal: 8,
    paddingBottom: 10,
  },

  name: {
    fontSize: 12,
    fontWeight: "700",
    color: "#111",
  },

  description: {
    fontSize: 10,
    color: "#6b7280",
    marginVertical: 2,
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },

  ratingText: {
    fontSize: 10,
    color: "#6b7280",
    marginLeft: 4,
  },

  bottom: {
    marginTop: 6,
  },

  price: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },

  cartBtn: {
    backgroundColor: "#14532d",
    paddingVertical: 5,
    borderRadius: 16,
    alignItems: "center",
  },

  cartText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "600",
  },
});
