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
      const existingProductIndex = cart.products.findIndex((p) => p.id === id);
      const existingProduct = cart.products[existingProductIndex];

      let newProduct = { id, quantity: 1 };
      if (existingProduct) {
        newProduct = { ...existingProduct };
        newProduct.quantity++;
        cart.products = [...cart.products]; // immutable way; непонятно зачем ведь все равно копируются ссылки; глянуть его видео по immutable
        cart.products[existingProductIndex] = newProduct;
      } else {
        cart.products = [...cart.products, newProduct];
      }

      cart.totalPrice += +productPrice;
      fs.writeFile(filePath, JSON.stringify(cart));
    });
  }
}

module.exports = Cart;
