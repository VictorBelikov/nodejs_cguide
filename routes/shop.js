const path = require('path');
const express = require('express');

const rootDir = require('../util/path');
const adminData = require('./admin');

const router = express.Router();

router.get('/', (req, res) => {
  // res.sendFile(path.join(rootDir, 'views/shop.html'));

  // render uses a default template engine
  res.render('shop', {
    prods: adminData.products,
    pageTitle: 'Shop',
    path: '/',
    hasProducts: adminData.products.length > 0,
    activeShop: true,
    productCSS: true,
    layout: false, // if you don't want to include this file into the layout
  });
});

module.exports = router;
