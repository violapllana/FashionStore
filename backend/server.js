const express = require("express");
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
require("dotenv").config();
const sequelize = require("./config/db");
const path = require("path");

const open = (...args) => import("open").then(module => module.default(...args));

const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const favoriteRoutes = require("./routes/favoriteRoutes");
const cartRoutes = require("./routes/cartRoutes");
const chatRoutes = require("./routes/chatRoutes");
const orderRoutes = require("./routes/orderRoutes");
const contactRoutes = require("./routes/contactRoutes");
const adminDashboard = require("./routes/adminDashboard");

const app = express();

/* =======================
   MIDDLEWARES
======================= */
app.use(express.json());

app.use(cors({
  origin: "http://localhost:8081",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

// Optional – për imazhe/uploads
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
  next();
});

/* =======================
   STATIC FILES
======================= */


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

/* =======================
   ROUTES
======================= */
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin/dashboard", adminDashboard);

require("./swagger")(app);

/* =======================
   SOCKET.IO
======================= */
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("Client Connected:", socket.id);

  socket.on("sendMessage", (data) => {
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client Disconnected:", socket.id);
  });
});
app.set("io", io);
/* =======================
   DATABASE
======================= */
sequelize.sync()
  .then(() => console.log("✅ Database connected"))
  .catch(err => console.log("❌ DB Error:", err));

/* =======================
   SERVER START
======================= */
const PORT = process.env.PORT || 5000;

server.listen(PORT, async () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);

  try {
    await open(`http://localhost:${PORT}/api-docs`);
  } catch (err) {
    console.log("Open browser error:", err);
  }
});
