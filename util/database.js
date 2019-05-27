// ==================================== MySql =================================

// const mysql2 = require('mysql2');

// const pool = mysql2.createPool({
//   port: 3307,
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: '1111111831V1ctoR',
// });

// module.exports = pool.promise();

// =============================== MySql + Sequelize ==========================

// const Sequelize = require('sequelize');
//
// const sequelize = new Sequelize('node-complete', 'root', '1111111831V1ctoR', {
//   dialect: 'mysql',
//   port: 3307,
//   host: 'localhost',
// });
//
// module.exports = sequelize;

// ============================= MongoDB without mongoose =====================

const mongodb = require('mongodb');

const { MongoClient } = mongodb;
let _db;

const mongoConnect = (cb) => {
  MongoClient.connect(
    'mongodb+srv://V1ctoR:nodeCompleteGuide@node-complete-mongo-z5sxq.mongodb.net/shop?retryWrites=true',
    { useNewUrlParser: true },
  )
    .then((client) => {
      console.log('Connected to MongoDB...');
      _db = client.db();
      cb();
    })
    .catch((err) => {
      throw err;
    });
};

const getDb = () => {
  if (_db) return _db;
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
