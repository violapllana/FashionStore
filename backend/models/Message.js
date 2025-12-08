const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./User");

const Message = sequelize.define("Message", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  text: { type: DataTypes.TEXT },
  sender: { type: DataTypes.STRING }, // 'user' | 'admin'
}, { timestamps: true });

Message.belongsTo(User, { onDelete: "SET NULL" });

module.exports = Message;
