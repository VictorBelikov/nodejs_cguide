const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errController = require('./controllers/error');
// db and realtions
const sequelize = require('./util/database');
const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cart-item');
const Order = require('./models/order');
const OrderItem = require('./models/order-item');

const app = express();

// set value globally on our express application
app.set('view engine', 'ejs'); // our template engine
app.set('views', 'views'); // where our views are stored

app.use(bodyParser.urlencoded({ extended: false }));

// Позволяет обслуживать static(кот.не обслуж. маршрутами) файлы в указ.дериктории
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => User.findById(1)
  .then((user) => {
    req.user = user;
    next();
  })
  .catch((err) => console.log(err)));

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Если ни один из маршрутов не будет обработан
app.use(errController.get404Page);

// Set relations in db with sequelize
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Product);
Cart.belongsTo(User);
User.hasOne(Cart);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// При запуске сервера просматривает все созданные нами модели, затем создает соответств. таблицы в БД
sequelize
// .sync({ force: true })
  .sync()
  // Здесь мы проверяем есть ли User в БД, иначе сервер не будет запущен. Используем же юзера уже посредством middleware.
  .then(() => User.findById(1))
  .then((user) => {
    if (!user) {
      const newUser = User.create({ name: 'Victor', email: 'example@gmail.com' });
      newUser.createCart();
      return newUser;
    }
    return user;
  })
  .then(() => app.listen(3000, () => console.log('Server is running on port 3000...')))
  .catch((err) => console.log(err));

// ========================= Create server ====================================

// const server = http.createServer(app);
// server.listen(3000, () => console.log('Server is running on port 3000...'));

// more simple way
// app.listen(3000, () => console.log('Server is running on port 3000...'));
// because:
// app.listen = function listen() {
//   var server = http.createServer(this);
//   return server.listen.apply(server, arguments);
// };

// mongodb+srv://V1ctoR:nodeCompleteGuide@node-complete-mongo-z5sxq.mongodb.net/test?retryWrites=true
