const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");
const Favorite = require("./Favorite");
const CartItem = require("./CartItem");
const { Order, OrderItem } = require("./Order");


User.hasMany(Favorite);
Favorite.belongsTo(User);
Product.hasMany(Favorite);
Favorite.belongsTo(Product);


User.hasMany(CartItem);
CartItem.belongsTo(User);
Product.hasMany(CartItem);
CartItem.belongsTo(Product);






module.exports = {
  sequelize,
  User,
  Product,
  Favorite,
  CartItem,
  Order,
  OrderItem,
};
