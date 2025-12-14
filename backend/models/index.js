const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");
const Favorite = require("./Favorite");
const CartItem = require("./CartItem");
const Message = require("./Message");
const { Order, OrderItem } = require("./Order");

// Associations
User.hasMany(Favorite);
Product.hasMany(Favorite);

User.hasMany(CartItem);
Product.hasMany(CartItem);

User.hasMany(Message);

module.exports = {
  sequelize,
  User,
  Product,
  Favorite,
  CartItem,
  Message,
  Order,
  OrderItem,
};
