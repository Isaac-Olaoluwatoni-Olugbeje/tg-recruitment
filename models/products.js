const mysql = require('mysql2/promise');

const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'Salvation144k',
    database: 'tg_recruitment',
    waitForConnections: true,
    connectionLimit: 10,
};

const pool = mysql.createPool(dbConfig);

const Product = {
  async createProduct(productName, seedTypes) {
    const [result] = await pool.execute(
      'INSERT INTO products (product_name, seed_types) VALUES (?, ?)',
      [productName, JSON.stringify(seedTypes)]
    );
    const product = { id: result.insertId, product_name: productName, seed_types: seedTypes };
    return product;
  },

  async findProductById(productId) {
    const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [productId]);
    if (rows.length === 0) {
      return null;
    }
    const { id, product_name: productName, seed_types: seedTypes } = rows[0];
    return { id, product_name: productName, seed_types: JSON.parse(seedTypes) };
  },

  async getAllProducts() {
    const [rows] = await pool.execute('SELECT * FROM products');
    const products = rows.map(({ id, product_name: productName, seed_types: seedTypes }) => ({ id, product_name: productName, seed_types: seedTypes }));
    return products;
  },  

  async getWithSeedTypes() {
    const [rows] = await pool.execute('SELECT * FROM products');
    const products = rows.map(({ id, product_name: productName, seed_types: seedTypes }) => ({ id, product_name: productName, seed_types: seedTypes }));
    for (const product of products) {
      const [rows] = await pool.execute('SELECT * FROM products WHERE id = ?', [product.id]);
      product.seedTypes = rows.map(row => ({
        id: row.id,
        name: row.name
      }));      
    }
    return products;
  },

  async createOperatorProduct(operatorId, productId, seedTypes) {
    const [result] = await pool.execute(
      'INSERT INTO product_selections (operator_id, product_id, seed_type) VALUES (?, ?, ?)',
      [operatorId, productId, JSON.stringify(seedTypes)]
    );
    const operatorProduct = { id: result.insertId, operator_id: operatorId, product_id: productId, seed_types: seedTypes, status: "Pending" };
    return operatorProduct;
  },

  async getOperatorProducts(operatorId) {
    const [result] = await pool.execute(
      'SELECT * FROM product_selections WHERE operator_id = ?',
      [operatorId]
    );
    const operatorProducts = result.map(product => ({ id: product.id, operator_id: product.operator_id, product_name: product.product_name, seed_types: JSON.parse(product.seed_types), status: product.status }));
    return operatorProducts;
  },

  async updateOperatorProducts(selectionId, ProductId, seedTypes, status) {
    await pool.execute(
      'UPDATE product_selections SET product_id = ?, seed_type_id = ? WHERE id = ?',
      [JSON.stringify(seedTypes), status, selectionId, ProductId]
    );
    const [result] = await pool.execute(
      'SELECT operator_id, product_id, seed_type_id FROM product_selections WHERE id = ?',
      [ProductId]
    );
    return result[0];
  },

  async deleteOperatorProducts(operatorProductId) {
    await pool.execute(
      'DELETE FROM product_selections WHERE id = ?',
      [operatorProductId]
    );
    return true;
  },

};

module.exports = Product;
