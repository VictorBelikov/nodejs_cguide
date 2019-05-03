const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const filePath = path.join(rootDir, 'data/cart.json');

class Cart {
  static addProduct(id) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      const cart = data.toString() ? JSON.parse(data) : { products: [], totalPrice: 0 };
      const existingProduct = cart.products.find((p) => p.id === id);

      if (existingProduct) {
      }
    });
  }
}

module.exports = Cart;
