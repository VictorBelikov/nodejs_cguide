const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(
    req.body.title,
    req.body.price,
    req.body.description,
    req.body.imageUrl,
    null,
    req.user._id,
  );
  product
    .save()
    .then(() => res.redirect('/products'))
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit; // http://localhost:3000/edit-product/123?edit=smth

  if (!editMode) return res.redirect('/');

  Product.findById(req.params.productId)
    .then((product) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product,
      });
    })
    .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  const updatedProduct = new Product(
    req.body.title,
    req.body.price,
    req.body.description,
    req.body.imageUrl,
    req.body.productId,
  );
  updatedProduct
    .save()
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.fetchAll()
    .then((products) => {
      res.render('admin/products', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/admin/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.postDeleteProduct = (req, res) => {
  Product.deletedById(req.body.productId)
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};
