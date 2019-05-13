const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getIndex = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/index', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res) => {
  Product.findAll()
    .then((products) => {
      res.render('shop/product-list', {
        prods: products,
        pageTitle: 'All Products',
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getProduct = (req, res) => {
  const { productId } = req.params;
  Product.findById(productId)
    .then(([product]) => {
      console.log(product);
      res.render('shop/product-detail', {
        product: product[0],
        pageTitle: product[0].title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  Cart.getCart((cart) => {
    const cartProducts = [];

    Product.fetchAll((products) => {
      products.forEach((p) => {
        const cartProductData = cart.products.find((cartProd) => cartProd.id === p.id);
        if (cartProductData) {
          cartProducts.push({ productData: p, quantity: cartProductData.quantity });
        }
      });
      res.render('shop/cart', { path: '/cart', pageTitle: 'Cart', products: cartProducts });
    });
  });
};

exports.postCart = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.addProduct(productId, product.price);
  });
  res.redirect('/cart');
};

exports.postCartDeleteProduct = (req, res) => {
  const { productId } = req.body;
  Product.findById(productId, (product) => {
    Cart.deleteProduct(productId, product.price);
    res.redirect('/cart');
  });
};

exports.getOrders = (req, res) => {
  res.render('shop/orders', { path: '/orders', pageTitle: 'Orders' });
};

exports.getCheckout = (req, res) => {
  res.render('shop/checkout', { path: '/checkout', pageTitle: 'Checkout' });
};
