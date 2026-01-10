const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");
const Product = require("./Product");

const Order = sequelize.define(
  "Order",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    totalPrice: { type: DataTypes.FLOAT, allowNull: false },

    status: {
      type: DataTypes.ENUM("pending", "completed", "canceled"),
      defaultValue: "pending",
    },

    paymentMethod: {
      type: DataTypes.ENUM("CASH"),
      defaultValue: "CASH",
    },

    paymentStatus: {
      type: DataTypes.ENUM("UNPAID", "PAID"),
      defaultValue: "UNPAID",
    },

    deliveryAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { timestamps: true }
);

Order.belongsTo(User, { onDelete: "CASCADE" });

const OrderItem = sequelize.define(
  "OrderItem",
  {
    quantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 1 },
    price: { type: DataTypes.FLOAT, allowNull: false },
  },
  { timestamps: false }
);

Order.hasMany(OrderItem, { as: "items", onDelete: "CASCADE" });
OrderItem.belongsTo(Order);
OrderItem.belongsTo(Product);

module.exports = { Order, OrderItem };
