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

    // const cartProductIndex = this.cart.items.findIndex((p) => p._id === product._id);
    const updatedCart = { items: [{ productId: new mongodb.ObjectId(product._id), quantity: 1 }] };
    return db.collection('users').updateOne({ _id: mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
  }

  static findById(userId) {
    const db = getDb();
    return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
