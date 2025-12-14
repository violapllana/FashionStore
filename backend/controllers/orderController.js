const { Order, OrderItem, Product } = require("../models");

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { UserId: req.user.id },
      include: [
        {
          model: OrderItem,
          as: "items",
          include: Product,
        },
      ],
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body; // items = [{ productId, quantity }]
    if (!items || items.length === 0)
      return res.status(400).json({ message: "No items" });

    // Llogarit totalPrice
    let totalPrice = 0;
    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      totalPrice += product.price * item.quantity;
    }

    const order = await Order.create({ UserId: req.user.id, totalPrice });

    for (const item of items) {
      const product = await Product.findByPk(item.productId);
      await OrderItem.create({
        OrderId: order.id,
        ProductId: product.id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const fullOrder = await Order.findByPk(order.id, {
      include: [
  {
    model: OrderItem,
    as: "items",
    include: Product
  }
]
,
    });
    res.json(fullOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const order = await Order.findByPk(orderId);
    if (!order || order.UserId !== req.user.id)
      return res.status(404).json({ message: "Order not found" });
    order.status = status;
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    await Order.destroy({ where: { id: orderId, UserId: req.user.id } });
    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
