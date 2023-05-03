const express = require("express");
const Product = require("../models/products");
const checkOperator = require("../middleware/check_operator");
const Operator = require("../models/operators");

const router = express.Router();

// Select a product and seed type
router.post(
  "/operator/:operatorId/products",
  checkOperator,
  async (req, res) => {
    try {
      const { product_name, seed_types } = req.body;
      const { operatorId } = req.params;

      // Check if operator is verified
      const operator = await Operator.checkVerificationStatus(operatorId);
      if (operator.verification_status !== 'approved') {
        return res.status(403).json({ error: 'Operator not verified' });
      };

      // Check if product is available
      const availableProducts = await Product.getAllProducts();
      const product = availableProducts.find(
        (p) => p.product_name === product_name
      );
      if (!product) {
        return res.status(400).json({ error: "Invalid product selected" });
      };

      // Check if seed type is available
      const seedTypes = Object.values(product.seed_types).map((v) => v.name);
      console.log(seedTypes)
      if (!seedTypes.includes(seed_types)) {
        return res.status(400).json({ error: "Invalid seed type selected" });
      };

      // Create a new record in the operator products table
      const operatorProduct = await Product.createOperatorProduct(
        operatorId,
        product.id,
        seed_types
      );

      res.json({ message: "Products selection successful", operatorProduct });
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred");
    }
  }
);

// Get operator selections
router.get("/operator/:operatorId/products", async (req, res) => {
  try {
    const { operatorId } = req.params;

    // Get operator selections from database
    const operatorSelections = await Product.getOperatorProducts(operatorId);

    res.json(operatorSelections);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occurred");
  }
});

// Update operator selection
router.put(
  "/operator/:operatorId/selections/:selectionId",
  async (req, res) => {
    try {
      const { operatorId, selectionId } = req.params;
      const { productId, seedTypes, status } = req.body;

      // Update operator selection in database
      const updatedSelection = await Product.updateOperatorProducts(
        selectionId,
        productId,
        seedTypes,
        status
      );

      res.json(updatedSelection);
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred");
    }
  }
);

// Delete operator selection
router.delete(
  "/operator/:operatorId/selections/:selectionId",
  async (req, res) => {
    try {
      const { operatorId, selectionId } = req.params;

      // Delete operator selection from database
      await Product.deleteOperatorProducts(selectionId);

      res.sendStatus(204);
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred");
    }
  }
);

// Get all products
router.get("/products", async (req, res) => {
  try {
    const products = await Product.getAllProducts();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured");
  }
});

// Get all seed types
router.get("/seed-types", async (req, res) => {
  try {
    const seedTypes = await SeedType.getAll();
    res.json(seedTypes);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured");
  }
});

// Get all products and their corresponding seed types
router.get("/products-seed-types", async (req, res) => {
  try {
    const productsSeedTypes = await Product.getWithSeedTypes();
    res.json(productsSeedTypes);
  } catch (error) {
    console.log(error);
    res.status(500).send("An error occured");
  }
});

module.exports = router;
