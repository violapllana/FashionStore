const Product = require("../models/Product");

// exports.createProduct = async (req, res) => {
//   try {
//     console.log("BODY:", req.body);
//     console.log("FILE:", req.file);

//     const {
//       name,
//       description,
//       price,
//       category,
//       subcategory,
//       gender,
//       sizes,
//       colors
//     } = req.body;

//     const image = req.file ? req.file.filename : "default-product.jpg";

//     const product = await Product.create({
//       name,
//       description,
//       price,
//       category,
//       subcategory,
//       gender,
//       sizes: sizes ? JSON.parse(sizes) : [],
//       colors: colors ? JSON.parse(colors) : [],
//       image
//     });

//     res.status(201).json(product);
//   } catch (err) {
//     console.error("Create product error:", err);
//     res.status(500).json({ message: "Error creating product" });
//   }
// };

exports.createProduct = async (req, res) => {
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

    const image = req.file ? req.file.filename : "default-product.jpg";

    const product = await Product.create({
      name,
      description,
      price,
      category,
      subcategory,
      gender,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      image,
    });

    const io = req.app.get("io");

    io.emit("newProduct", {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error("Create product error:", err);
    res.status(500).json({ message: "Error creating product" });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const image = req.file ? req.file.filename : product.image;

    await product.update({
      ...req.body,
      image,
      sizes: req.body.sizes ? JSON.parse(req.body.sizes) : product.sizes,
      colors: req.body.colors ? JSON.parse(req.body.colors) : product.colors,
    });

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Error updating product" });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByPk(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    await product.destroy();
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting product" });
  }
};
