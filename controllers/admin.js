const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    imageUrl: req.body.imageUrl,
    userId: req.user, // mongoose picked id automatically
  });

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
  Product.findById(req.body.productId)
    .then((product) => {
      product.title = req.body.title;
      product.price = req.body.price;
      product.description = req.body.description;
      product.imageUrl = req.body.imageUrl;
      product.save();
    })
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.find()
  // .select('title price -_id')
  // .populate('userId', 'name')
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
  Product.findByIdAndDelete(req.body.productId)
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};
