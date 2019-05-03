const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const filePath = path.join(rootDir, 'data/cart.json');

class Cart {
  static addProduct(id, productPrice) {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err);
        return;
      }
      const cart = data.toString() ? JSON.parse(data) : { products: [], totalPrice: 0 };
      const existingProduct = cart.products.find((p) => p.id === id);

      let updatedProduct;
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.quantity++;
      } else {
        updatedProduct = { id, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += productPrice;
      fs.writeFile(filePath, JSON.stringify(cart), (e) => console.log(e));
    });
  }
}

module.exports = Cart;
