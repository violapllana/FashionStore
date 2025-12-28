const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();
const sequelize = require("./config/db");
const path = require("path");


const open = (...args) => import('open').then(module => module.default(...args));


const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const cartRoutes = require("./routes/cartRoutes");
const chatRoutes = require("./routes/chatRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");

const app = express();
app.use(cors());
app.use(express.json());


require('./swagger')(app);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// Routes
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);





// Socket.IO
const server = http.createServer(app);
const io = socketIO(server, { cors: { origin: "*" } });

io.on("connection", (socket) => {
  console.log("Client Connected");

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client Disconnected");
  });
});

// Database connection
sequelize
  .sync()
  .then(() => console.log("Database connected"))
  .catch((err) => console.log("DB Error:", err));

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, async () => {
  console.log(`Backend running on port ${PORT}`);
  try {
    await open(`http://localhost:${PORT}/api-docs`);
  } catch (err) {
    console.log("Open browser error:", err);
  }
});
