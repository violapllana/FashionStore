const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define("Product", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  price: { type: DataTypes.FLOAT, allowNull: false }, 
  category: { type: DataTypes.STRING }, // Men/Women/Kids
  subcategory: { type: DataTypes.STRING }, // e.g. Jackets, Pants
  sizes: { type: DataTypes.JSON }, 
  colors: { type: DataTypes.JSON }, 
  imageUrl: { type: DataTypes.STRING }
}, { timestamps: true });

module.exports = Product;
