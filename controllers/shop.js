const Product = require('../models/product');

exports.getIndex = (req, res) => {
  Product.fetchAll()
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
  Product.fetchAll()
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
    .then((product) => {
      res.render('shop/product-detail', {
        product,
        pageTitle: product.title,
        path: '/products',
      });
    })
    .catch((err) => console.log(err));
};

exports.getCart = (req, res) => {
  req.user
    .getCart()
    .then((cart) =>
      cart.getProducts().then((products) => {
        res.render('shop/cart', { path: '/cart', pageTitle: 'Cart', products });
      }),
    )
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
  Product.findById(productId)
    .then((product) => req.user.addToCart(product))
    .then(() => res.redirect('/'))
    .catch((err) => console.log(err));

  // let fetchedCart = null;
  // let newQuantity = 1;
  //
  // req.user.getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getProducts({ where: { id: productId } });
  //   })
  //   .then((products) => {
  //     if (products.length) {
  //       const product = products[0];
  //       let oldQuantity = product.cartItem.quantity;
  //       newQuantity = ++oldQuantity;
  //       return product;
  //     }
  //     return Product.findById(productId); // Ищем не в корзине, а в общей базе продуктов
  //   })
  //   .then((p) => fetchedCart.addProduct(p, { through: { quantity: newQuantity } }))
  //   .then(() => res.redirect('/cart'))
  //   .catch((err) => console.log(err));
};

exports.postCartDeleteProduct = (req, res) => {
  const { productId } = req.body;
  req.user
    .getCart()
    .then((cart) => cart.getProducts({ where: { id: productId } }))
    .then((products) => products[0].cartItem.destroy())
    .then(() => res.redirect('/cart'))
    .catch((err) => console.log(err));
};

exports.getOrders = (req, res) => {
  req.user
    .getOrders({ include: ['products'] })
    .then((orders) => res.render('shop/orders', { path: '/orders', pageTitle: 'Orders', orders }))
    .catch((err) => console.log(err));
};

exports.postOrder = (req, res) => {
  let fetchedCart = null;
  let fetchedProducts = null;

  req.user
    .getCart()
    .then((cart) => {
      fetchedCart = cart;
      return fetchedCart.getProducts();
    })
    .then((products) => {
      fetchedProducts = products;
      return req.user.createOrder();
    })
    .then((order) =>
      order.addProducts(
        fetchedProducts.map((p) => {
          p.orderItem = { quantity: p.cartItem.quantity };
          return p;
        }),
      ),
    )
    .then(() => fetchedCart.setProducts(null)) // clear Cart
    .then(() => res.redirect('/orders'))
    .catch((err) => console.log(err));
};
