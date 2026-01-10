const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const CartItem = sequelize.define(
  "CartItem",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  },
  { timestamps: true }
);

CartItem.belongsTo(User, { onDelete: "CASCADE" });
CartItem.belongsTo(Product, { onDelete: "CASCADE" });

module.exports = CartItem;
