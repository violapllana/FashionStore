const { CartItem, Product } = require("../models");

exports.get = async (req, res) => {
  try {
    const items = await CartItem.findAll({
      where: { UserId: req.user.id },
      include: Product,
    });
    return res.json(items);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    const existing = await CartItem.findOne({
      where: { UserId: req.user.id, ProductId: productId },
    });
    if (existing) {
      existing.quantity += Number(quantity);
      await existing.save();
      return res.json(existing);
    }
    const item = await CartItem.create({
      UserId: req.user.id,
      ProductId: productId,
      quantity,
    });
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const item = await CartItem.findByPk(itemId);
    if (!item || item.UserId !== req.user.id)
      return res.status(404).json({ message: "Not found" });
    item.quantity = quantity;
    await item.save();
    return res.json(item);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { itemId } = req.params;
    await CartItem.destroy({ where: { id: itemId, UserId: req.user.id } });
    return res.json({ message: "Removed" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
