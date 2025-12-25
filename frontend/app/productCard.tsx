import { View, Text, Image, Pressable, StyleSheet, Dimensions } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const { width } = Dimensions.get("window");
const cardWidth = width / 2.2;

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

export default function ProductCard({
  product,
  addToCart,
  addToFavorites,
}: ProductCardProps) {
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
    borderRadius: 16,
    margin: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },

  favorite: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 20,
  },

  imageWrapper: {
    height: 140,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  image: {
    width: "100%",
    height: "100%",
  },

  info: {
    padding: 12,
  },

  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
  },

  description: {
    fontSize: 12,
    color: "#6b7280",
    marginVertical: 4,
  },

  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },

  ratingText: {
    fontSize: 11,
    color: "#6b7280",
    marginLeft: 4,
  },

  bottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },

  price: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
  },

  cartBtn: {
    backgroundColor: "#14532d",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  cartText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
