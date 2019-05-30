const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');

// routes
const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errController = require('./controllers/error');

const User = require('./models/user');

const app = express();

// set value globally on our express application
app.set('view engine', 'ejs'); // our template engine
app.set('views', 'views'); // where our views are stored

app.use(bodyParser.urlencoded({ extended: false }));

// Позволяет обслуживать static(кот.не обслуж. маршрутами) файлы в указ.дериктории
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
  User.findById('5ced1a8d1c580404741ebb26')
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => console.log(err));
});

// Routes
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(errController.get404Page); // Если ни один из маршрутов не будет обработан

mongoose
  .connect('mongodb+srv://V1ctoR:nodeCompleteGuide@node-complete-mongo-z5sxq.mongodb.net/shop?retryWrites=true', {
    useNewUrlParser: true,
  })
  .then(() => {
    User.findOne().then((user) => {
      if (!user) {
        const newUser = new User({
          name: 'Victor',
          email: 'victor@example.com',
          cart: { items: [] },
        });
        newUser.save();
      }
    });
    app.listen(3000, () => console.log('Server is running on port 3000...'.bgRed));
  })
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
