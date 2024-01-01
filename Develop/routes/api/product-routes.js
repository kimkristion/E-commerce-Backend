const express = require('express');
const router = express.Router();
const { Product, Category } = require('../../models');

// Route to get all products
router.get('/', async (req, res) => {
  try {
    // Fetch all products including associated category
    const products = await Product.findAll({
      include: [{ model: Category, as: 'category' }],
    });

    // Send the products as a JSON response
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to get a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findByPk(productId, {
      include: [{ model: Category, as: 'category' }],
    });

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to create a new product
router.post('/', async (req, res) => {
  try {
    const { product_name, price, category_id } = req.body; // Assuming the request body contains the product information

    // Create a new product
    const newProduct = await Product.create({
      product_name,
      price,
      category_id,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route to update a product by ID
router.put('/:id', async (req, res) => {
  try {
    const productId = req.params.id;
    const { product_name, price, category_id } = req.body;

    // Find the product by ID
    const product = await Product.findByPk(productId);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Update the product
    await product.update({
      product_name: product_name || product.product_name,
      price: price || product.price,
      category_id: category_id || product.category_id,
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Route to delete a product by ID
router.delete('/:id', async (req, res) => {
  try {
    const productId = req.params.id;

    // Find the product by ID
    const product = await Product.findByPk(productId);

    if (!product) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }

    // Delete the product
    await product.destroy();

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
