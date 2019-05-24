const mongodb = require('mongodb');

const { getDb } = require('../util/database');

class User {
  constructor(username, email, cart, id) {
    this.username = username;
    this.email = email;
    this.cart = cart; // { items: [] }; User can have only one cart.
    this._id = id;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then(() => console.log('User was sucessfully created!'.blue))
      .catch((err) => console.log(err));
  }

  addToCart(product) {
    const db = getDb();

    const updatedCartItems = [...this.cart.items];
    const cartProductIndex = updatedCartItems.findIndex((p) => p.productId.toString() === product._id.toString());

    if (cartProductIndex >= 0) {
      updatedCartItems[cartProductIndex].quantity++;
    } else {
      updatedCartItems.push({ productId: new mongodb.ObjectId(product._id), quantity: 1 });
    }
    const updatedCart = { items: updatedCartItems };
    return db.collection('users').updateOne({ _id: mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
