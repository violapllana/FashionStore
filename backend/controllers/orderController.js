const { Order, OrderItem, Product, User } = require("../models");

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    let orders;

    if (req.user.role === "admin") {
      // Admin merr të gjitha porositë
      orders = await Order.findAll({
        include: [
          { model: OrderItem, as: "items", include: [Product] },
          { model: User, attributes: ["id", "email"] },
        ],
        order: [["createdAt", "DESC"]],
      });
    } else {
      // Përdorues normal merr vetëm porositë e tij
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

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      totalPrice,
      UserId: req.user.id,
    });

    // Krijo OrderItems
    for (const item of items) {
      await OrderItem.create({
        OrderId: order.id,
        ProductId: item.productId,
        quantity: item.quantity,
        price: item.price,
      });
    }

    const newOrder = await Order.findByPk(order.id, {
      include: [{ model: OrderItem, as: "items", include: [Product] }],
    });

    res.json(newOrder);
  } catch (err) {
    console.error(err);
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

    // Vetëm admin mund të ndryshojë statusin e çdo porosie
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

    // Vetëm admin ose përdoruesi i vet mund të fshijë
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
