const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },

    name: { type: DataTypes.STRING, allowNull: false },

    description: { type: DataTypes.TEXT },

    price: { type: DataTypes.FLOAT, allowNull: false },

    category: { type: DataTypes.STRING }, 
    // Clothing / Footwear / Accessories

    subcategory: { type: DataTypes.STRING }, 
    // Tops / Jackets / Pants ...

    gender: {
      type: DataTypes.ENUM("Men", "Women", "Kids"),
      allowNull: false,
    },

    sizes: { type: DataTypes.JSON },

    colors: { type: DataTypes.JSON },

    image: { type: DataTypes.STRING },
  },
  { timestamps: true }
);

module.exports = Product;
