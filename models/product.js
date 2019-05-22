const mongodb = require('mongodb');
require('colors');

const { getDb } = require('../util/database');

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongodb.ObjectId(id) : null; // Т.к. заменить оно может если id передан как объект, а не как строка. MongoDb model rules.
  }

  save() {
    const db = getDb();
    let dbOp;

    if (this._id) {
      dbOp = db.collection('products').updateOne({ _id: new mongodb.ObjectId(this._id) }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp
      .then(() => console.log('Product was sucessfully created!'.blue))
      .catch((err) => console.log(err));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => products)
      .catch((err) => console.log(err));
  }

  static findById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .find({ _id: new mongodb.ObjectId(productId) })
      .next() // Get the next available document from the cursor. In our case we have only one.
      .then((product) => product)
      .catch((err) => console.log(err));
  }

  static deletedById(productId) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new mongodb.ObjectId(productId) })
      .then(() => console.log('Product was successfully deleted!'.red))
      .catch((err) => console.log(err));
  }
}

module.exports = Product;
