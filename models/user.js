const mongodb = require('mongodb');

const { getDb } = require('../util/database');

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    return db
      .collection('users')
      .insertOne(this)
      .then(() => console.log('User was sucessfully created!'.blue))
      .catch((err) => console.log(err));
  }

  static findById(userId) {
    const db = getDb();
    return db
      .collection('users')
      .findOne({ _id: new mongodb.ObjectId(userId) });
  }
}

module.exports = User;
