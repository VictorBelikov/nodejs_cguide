const Product = require('../models/product');

exports.getAddProduct = (req, res) => {
  res.render('admin/edit-product', {
    pageTitle: 'Add Product',
    path: '/admin/add-product',
    editing: false,
  });
};

exports.postAddProduct = (req, res) => {
  const product = new Product(req.body.title, req.body.price, req.body.description, req.body.imageUrl);
  product.save()
    .then(() => {
      console.log('Product was sucessfully created!');
      res.redirect('admin/products');
    })
    .catch((err) => console.log(err));
};

exports.getEditProduct = (req, res) => {
  const editMode = req.query.edit; // http://localhost:3000/edit-product/123?edit=smth

  if (!editMode) return res.redirect('/');

  req.user.getProducts({ where: { id: req.params.productId } })
    .then((products) => {
      res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/admin/edit-product',
        editing: editMode,
        product: products[0],
      });
    })
    .catch((err) => console.log(err));

  // or
  // Product.findById(req.params.productId)
  //   .then((product) => {
  //     res.render('admin/edit-product', {
  //       pageTitle: 'Edit Product',
  //       path: '/admin/edit-product',
  //       editing: editMode,
  //       product,
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.postEditProduct = (req, res) => {
  Product.findById(req.body.productId)
    .then((product) => {
      product.title = req.body.title;
      product.imageUrl = req.body.imageUrl;
      product.description = req.body.description;
      product.price = req.body.price;
      return product.save();
    })
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  req.user.getProducts()
  // Product.findAll()
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
  Product.findById(req.body.productId)
    .then((product) => product.destroy())
    .then(() => res.redirect('/admin/products'))
    .catch((err) => console.log(err));
};
