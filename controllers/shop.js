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

  // this way
  Product.findAll({ where: { id: productId } })
    .then((products) => {
      console.log(products[0]);
      res.render('shop/product-detail', {
        product: products[0],
        pageTitle: products[0].title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));

  // or this way
  // Product.findById(productId)
  //   .then((product) => {
  //     console.log(product);
  //     res.render('shop/product-detail', {
  //       product,
  //       pageTitle: product.title,
  //       path: '/products',
  //     });
  //   })
  //   .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  req.user.getCart()
    .then((cart) => cart.getProducts()
      .then((products) => {
        res.render('shop/cart', { path: '/cart', pageTitle: 'Cart', products });
      }))
    .catch((err) => console.log(err));

  // Cart.getCart((cart) => {
  //   const cartProducts = [];
  //
  //   Product.fetchAll((products) => {
  //     products.forEach((p) => {
  //       const cartProductData = cart.products.find((cartProd) => cartProd.id === p.id);
  //       if (cartProductData) {
  //         cartProducts.push({ productData: p, quantity: cartProductData.quantity });
  //       }
  //     });
  //     res.render('shop/cart', { path: '/cart', pageTitle: 'Cart', products: cartProducts });
  //   });
  // });
};

exports.postCart = (req, res) => {
  const { productId } = req.body;
  let fetchedCart = null;
  let newQuantity = 1;

  req.user.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getProducts({ where: { id: productId } });
    })
    .then((products) => {
      if (products.length) {
        const product = products[0];
        let oldQuantity = product.cartItem.quantity;
        newQuantity = ++oldQuantity;
        return fetchedCart.addProduct(product, { through: { quantity: newQuantity } });
      }
      return Product.findById(productId) // Ищем не в корзине, а в общей базе продуктов
        .then((p) => fetchedCart.addProduct(p, { through: { quantity: newQuantity } }))
        .catch((err) => console.log(err));
    })
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
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
