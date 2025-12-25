const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { createProduct, getProducts, updateProduct, deleteProduct } = require('../controllers/productController');

// Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// CRUD
router.post('/', upload.single('image'), createProduct);
router.get('/', getProducts);
router.put('/:id', upload.single('image'), updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
