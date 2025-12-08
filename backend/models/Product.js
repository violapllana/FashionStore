const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false }, // store base price in USD
  category: { type: DataTypes.STRING },
  sizes: { type: DataTypes.JSON }, // e.g. ["S","M","L"]
  colors: { type: DataTypes.JSON }, // e.g. ["red","blue"]
  imageUrl: { type: DataTypes.STRING }
}, { timestamps: true });

module.exports = Product;
