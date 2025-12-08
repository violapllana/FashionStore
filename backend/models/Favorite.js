const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const Favorite = sequelize.define("Favorite", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true }
}, { timestamps: true });

Favorite.belongsTo(User, { onDelete: "CASCADE" });
Favorite.belongsTo(Product, { onDelete: "CASCADE" });

module.exports = Favorite;
