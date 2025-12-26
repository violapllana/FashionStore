const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      subcategory,
      gender,
      sizes,
      colors,
    } = req.body;

    const image = req.file ? req.file.filename : null;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      subcategory,
      gender, // 🔥 RUHET KËTU
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      image,
    });

    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    const {
      name,
      description,
      price,
      category,
      subcategory,
      gender,
      sizes,
      colors,
    } = req.body;

    let image = product.image;
    if (req.file) {
      image = req.file.filename;
    }

    await product.update({
      name,
      description,
      price,
      category,
      subcategory,
      gender, // 🔥 UPDATE
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      image,
    });

    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    await product.destroy();
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { createProduct, getProducts, updateProduct, deleteProduct };
