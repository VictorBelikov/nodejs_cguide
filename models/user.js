const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
  },
});

userSchema.methods.addToCart = function(product) {
  const updatedCartItems = [...this.cart.items];
  const cartProductIndex = updatedCartItems.findIndex((p) => p.productId.toString() === product._id.toString());

  if (cartProductIndex >= 0) {
    updatedCartItems[cartProductIndex].quantity++;
  } else {
    updatedCartItems.push({
      productId: product._id,
      quantity: 1,
    });
  }
  const updatedCart = { items: updatedCartItems };
  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.deleteItemFromCart = function(productId) {
  const updatedCartItems = this.cart.items.filter((p) => p.productId.toString() !== productId.toString());
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.getOrders = function() {};

userSchema.methods.addOrder = function() {};

module.exports = mongoose.model('User', userSchema);

// const mongodb = require('mongodb');
//
// const { getDb } = require('../util/database');
//
// class User {
//   constructor(username, email, cart, id) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart; // { items: [] }; User can have only one cart.
//     this._id = id;
//   }
//
//   save() {
//     const db = getDb();
//     return db
//       .collection('users')
//       .insertOne(this)
//       .then(() => console.log('User was sucessfully created!'.blue))
//       .catch((err) => console.log(err));
//   }
//
//   deleteItemFromCart(productId) {
//     const db = getDb();
//
//     const updatedCartItems = this.cart.items.filter(
//       (i) => i.productId.toString() !== productId.toString(),
//     );
//
//     return db
//       .collection('users')
//       .updateOne(
//         { _id: mongodb.ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } },
//       );
//   }
//
//   getCart() {
//     const db = getDb();
//     const productIDs = this.cart.items.map((p) => p.productId); // in current cart
//     return db
//       .collection('products')
//       .find({ _id: { $in: productIDs } }) // return all these product from DB
//       .toArray()
//       .then((products) => {
//         if (products.length) {
//           if (products.length !== productIDs.length) {
//             db.collection('users').updateOne(
//               { _id: mongodb.ObjectId(this._id) },
//               { $set: { cart: { items: products } } },
//             );
//           }
//           return products.map((p) => {
//             return {
//               ...p,
//               quantity: this.cart.items.find(
//                 (i) => i.productId.toString() === p._id.toString(),
//               ).quantity,
//             };
//           });
//         }
//         db.collection('users').updateOne(
//           { _id: mongodb.ObjectId(this._id) },
//           { $set: { cart: { items: [] } } },
//         );
//         return [];
//       });
//   }
//
//   addToCart(product) {
//     const db = getDb();
//
//     const updatedCartItems = [...this.cart.items];
//     const cartProductIndex = updatedCartItems.findIndex(
//       (p) => p.productId.toString() === product._id.toString(),
//     );
//
//     if (cartProductIndex >= 0) {
//       updatedCartItems[cartProductIndex].quantity++;
//     } else {
//       updatedCartItems.push({
//         productId: new mongodb.ObjectId(product._id),
//         quantity: 1,
//       });
//     }
//     const updatedCart = { items: updatedCartItems };
//     return db
//       .collection('users')
//       .updateOne({ _id: mongodb.ObjectId(this._id) }, { $set: { cart: updatedCart } });
//   }
//
//   static findById(userId) {
//     const db = getDb();
//     return db.collection('users').findOne({ _id: new mongodb.ObjectId(userId) });
//   }
//
//   addOrder() {
//     const db = getDb();
//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new mongodb.ObjectId(this._id),
//             name: this.username,
//           },
//         };
//         return db.collection('orders').insertOne(order);
//       })
//       .then(() =>
//         db
//           .collection('users')
//           .updateOne(
//             { _id: mongodb.ObjectId(this._id) },
//             { $set: { cart: { items: [] } } },
//           ),
//       )
//       .then(() => console.log('Order was added!'.blue))
//       .catch((err) => console.log(err));
//   }
//
//   getOrders() {
//     const db = getDb();
//     return db
//       .collection('orders')
//       .find({ 'user._id': new mongodb.ObjectId(this._id) })
//       .toArray();
//   }
// }
//
// module.exports = User;
