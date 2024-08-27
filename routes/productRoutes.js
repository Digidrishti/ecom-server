// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const ProductCategory = require('../models/ProductCategory');
const ProductType = require('../models/ProductType');
const multer = require('multer');

// Save Product Category

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

router.post('/category', upload.single('img'), async (req, res) => {
  console.log(res)
  try {
    const { categoryName, productTypes } = req.body;
    const newCategory = new ProductCategory({ img: req.file.path, categoryName, productTypes });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Save Product Type
router.post('/type', async (req, res) => {
  try {
    const { typeName, categoryId } = req.body;
    const category = await ProductCategory.findById(categoryId);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    const newType = new ProductType({ typeName, category: categoryId });
    await newType.save();
    category.productTypes.push(newType._id);
    await category.save();
    res.status(201).json(newType);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Product Categories
router.get('/categories', async (req, res) => {
  try {
    const categories = await ProductCategory.find().populate('productTypes');
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get All Product Types
router.get('/types', async (req, res) => {
  try {
    const types = await ProductType.find().populate('category');
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;