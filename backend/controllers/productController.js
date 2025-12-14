const { Product } = require("../models");
const { Op } = require("sequelize");
exports.create = async (req, res) => {
  try {
    const body = req.body;

    // Siguro array
    if (body.sizes && typeof body.sizes === "string") {
      body.sizes = body.sizes.split(',').map(s => s.trim()).filter(s => s);
    }
    if (body.colors && typeof body.colors === "string") {
      body.colors = body.colors.split(',').map(c => c.trim()).filter(c => c);
    }

    const product = await Product.create(body);
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Not found" });

    const body = req.body;

    if (body.sizes && typeof body.sizes === "string") {
      body.sizes = body.sizes.split(',').map(s => s.trim()).filter(s => s);
    }
    if (body.colors && typeof body.colors === "string") {
      body.colors = body.colors.split(',').map(c => c.trim()).filter(c => c);
    }

    await product.update(body);
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};


exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ message: "Not found" });
    await product.destroy();
    return res.json({ message: "Deleted" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.getOne = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    return res.json(product);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, size, color, page = 1, limit = 20 } = req.query;
    const where = {};
    if (q) where.name = { [Op.like]: `%${q}%` };
    if (category) where.category = category;
    if (minPrice || maxPrice) where.price = {};
    if (minPrice) where.price[Op.gte] = Number(minPrice);
    if (maxPrice) where.price[Op.lte] = Number(maxPrice);
    // sizes & colors are JSON arrays stored; query with LIKE (simple)
    if (size) where.sizes = { [Op.like]: `%${size}%` };
    if (color) where.colors = { [Op.like]: `%${color}%` };

    const offset = (page - 1) * limit;
    const items = await Product.findAndCountAll({ where, limit: Number(limit), offset: Number(offset), order: [["createdAt","DESC"]] });
    return res.json({ total: items.count, products: items.rows });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
