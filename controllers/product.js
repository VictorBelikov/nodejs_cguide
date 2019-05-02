const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  // res.sendFile(path.join(rootDir, 'views/add-product.html'));
  res.render('add-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    activeAddProduct: true,
    formsCSS: true,
    productCSS: true,
  });
};

exports.postAddProduct = (req, res) => {
  // console.log(req.body); // [Object: null prototype] { title: 'someTitle' }
  const product = new Product(req.body.title);
  product.save();
  res.redirect('/');
};

exports.getAddProducts = (req, res) => {
  // res.sendFile(path.join(rootDir, 'views/shop.html'));

  Product.fetchAll((products) => {
    res.render('shop', {
      prods: products,
      pageTitle: 'Shop',
      path: '/',
      hasProducts: products.length > 0,
      activeShop: true,
      productCSS: true,
      layout: false, // if you don't want to include this file into the layout
    });
  });
};
