const express = require('express');
const Product = require('../models/products');
const checkAdmin = require('../middleware/check_admin');

const router = express.Router();

// Add a new product
router.post('/add', checkAdmin, async (req, res) => {
  try {
    const { product_name: productName, seed_types: seedTypes } = req.body;
    const product = await Product.createProduct(productName, seedTypes);
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).send('An error occurred');
  }
});

module.exports = router;
