const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");
const Favorite = require("./Favorite");
const CartItem = require("./CartItem");
const Message = require("./Message");
const { Order, OrderItem } = require("./Order");

// Favorites
User.hasMany(Favorite);
Favorite.belongsTo(User);
Product.hasMany(Favorite);
Favorite.belongsTo(Product);

// CartItems
User.hasMany(CartItem);
CartItem.belongsTo(User);
Product.hasMany(CartItem);
CartItem.belongsTo(Product);

// Messages
User.hasMany(Message);
Message.belongsTo(User);



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
