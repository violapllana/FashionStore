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

    subcategory: { type: DataTypes.STRING }, 

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


Product.addHook("afterFind", (products) => {
  if (Array.isArray(products)) {
    products.forEach((product) => {
      if (product.image) {
        product.image = `http://localhost:5000/uploads/${product.image}`;
      }
    });
  } else if (products && products.image) {
    products.image = `http://localhost:5000/uploads/${products.image}`;
  }
});

module.exports = Product;
