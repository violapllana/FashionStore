const express = require("express");
const router = express.Router();

const User = require("../models/User");
const { Order } = require("../models/Order");
const Contact = require("../models/Contact");
const CartItem = require("../models/CartItem");
const Favorite = require("../models/Favorite");
const Product = require("../models/Product");

router.get("/stats", async (req, res) => {
  try {
    const result = {
      totalUsers: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalContacts: 0,
      totalCart: 0,
      totalFavorites: 0,
    };

    try {
      result.totalUsers = await User.count();
    } catch (e) {
      console.error("USER:", e.message);
    }
    try {
      result.totalOrders = await Order.count();
    } catch (e) {
      console.error("ORDER:", e.message);
    }
    try {
      result.totalProducts = await Product.count();
    } catch (e) {
      console.error("PRODUCT:", e.message);
    }
    try {
      result.totalContacts = await Contact.count();
    } catch (e) {
      console.error("CONTACT:", e.message);
    }
    try {
      result.totalCart = await CartItem.count();
    } catch (e) {
      console.error("CART:", e.message);
    }
    try {
      result.totalFavorites = await Favorite.count();
    } catch (e) {
      console.error("FAVORITE:", e.message);
    }

    res.json(result);
  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
