const { Favorite, Product } = require("../models");

exports.getAll = async (req, res) => {
  try {
    const favorites = await Favorite.findAll({ where: { UserId: req.user.id }, include: Product });
    return res.json(favorites);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.add = async (req, res) => {
  try {
    const { productId } = req.body;
    // prevent duplicates
    const existing = await Favorite.findOne({ where: { UserId: req.user.id, ProductId: productId }});
    if (existing) return res.status(200).json({ message: "Already favorite" });
    const fav = await Favorite.create({ UserId: req.user.id, ProductId: productId });
    return res.json(fav);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { productId } = req.params;
    await Favorite.destroy({ where: { UserId: req.user.id, ProductId: productId }});
    return res.json({ message: "Removed" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
