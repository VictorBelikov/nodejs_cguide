const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errController = require('./controllers/error');

const { mongoConnect } = require('./util/database');
const User = require('./models/user');

const app = express();

// set value globally on our express application
app.set('view engine', 'ejs'); // our template engine
app.set('views', 'views'); // where our views are stored

app.use(bodyParser.urlencoded({ extended: false }));

// Позволяет обслуживать static(кот.не обслуж. маршрутами) файлы в указ.дериктории
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5ce55e731c9d4400004fe866')
    .then((user) => {
      req.user = new User(user.name, user.email, user.cart, user._id);
      next();
    })
    .catch((err) => console.log(err));
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Если ни один из маршрутов не будет обработан
app.use(errController.get404Page);

mongoConnect(() => app.listen(3000, () => console.log('Server is running on port 3000...')));

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
