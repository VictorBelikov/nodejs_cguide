// const mysql2 = require('mysql2');

// const pool = mysql2.createPool({
//   port: 3307,
//   host: 'localhost',
//   user: 'root',
//   database: 'node-complete',
//   password: '1111111831V1ctoR',
// });

// module.exports = pool.promise();

// ============================================================================

const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', '1111111831V1ctoR', {
  dialect: 'mysql',
  port: 3307,
  host: 'localhost',
});

module.exports = sequelize;
