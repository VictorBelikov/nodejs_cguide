const fs = require('fs');
const path = require('path');

const rootDir = require('../util/path');

const filePath = path.join(rootDir, 'data/products.json');

const getProductsFromFile = (cb) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    data.toString() ? cb(JSON.parse(data)) : cb([]);
  });
};

class Product {
  constructor(title, imageUrl, description, price) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    getProductsFromFile((products) => {
      products.push(this);
      fs.writeFile(filePath, JSON.stringify(products), (err) => console.log(err));
    });
  }

  static fetchAll(cb) {
    getProductsFromFile(cb);
  }
}

module.exports = Product;
