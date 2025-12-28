const { Order, OrderItem, Product, User, CartItem } = require("../models");

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === "admin") {
      orders = await Order.findAll({
        include: [
          { model: OrderItem, as: "items", include: [Product] },
          { model: User, attributes: ["id", "email"] },
        ],
        order: [["createdAt", "DESC"]],
      });
    } else {
      orders = await Order.findAll({
        where: { UserId: req.user.id },
        include: [{ model: OrderItem, as: "items", include: [Product] }],
        order: [["createdAt", "DESC"]],
      });
    }

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
const createOrder = async (req, res) => {
  try {
    const user = req.user;

    // 🔴 kontrollo a ka adresë
    if (!user.addressLine || !user.city) {
      return res.status(400).json({ 
        message: "Please add delivery address in your profile" 
      });
    }

    const cartItems = await CartItem.findAll({
      where: { UserId: user.id },
      include: [Product],
    });

    if (!cartItems.length) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + item.quantity * item.Product.price,
      0
    );

    // 🔽 ADRESA SNAPSHOT
    const fullAddress = `${user.addressLine}, ${user.city} ${user.postalCode || ""}`;

    const order = await Order.create({
      UserId: user.id,
      totalPrice,
      deliveryAddress: fullAddress,
      paymentMethod: "CASH",
      paymentStatus: "UNPAID"
    });

    for (const item of cartItems) {
      await OrderItem.create({
        OrderId: order.id,
        ProductId: item.Product.id,
        quantity: item.quantity,
        price: item.Product.price,
      });
    }

    await CartItem.destroy({ where: { UserId: user.id } });

    const newOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: "items", include: [Product] }],
    });

    res.json(newOrder);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// PUT /api/orders/:orderId
const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.UserId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// DELETE /api/orders/:orderId
const deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findByPk(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (req.user.role !== "admin" && order.UserId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    await order.destroy();
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  deleteOrder,
};
