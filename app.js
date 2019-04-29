const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const expressHbs = require('express-handlebars');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.engine('hbs', expressHbs());
// set value globally on out express application
app.set('view engine', 'hbs'); // our template engine
app.set('views', 'views'); // where our views save

app.use(bodyParser.urlencoded({ extended: false }));

// Позволяет обслуживать статические(кот.не обслуж. маршрутами) файлы
// в указ.дериктории
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

// Если ни один из маршрутов не будет обработан
app.use((req, res) => {
  // res.status(404).sendFile(path.join(__dirname, './views/404.html'));
  res.status(404).render('404', { pageTitle: 'Page Not Found' });
});

// ============================================================================

// const server = http.createServer(app);
// server.listen(3000, () => console.log('Server is running on port 3000...'));

// more simple way
app.listen(3000, () => console.log('Server is running on port 3000...'));

// because:
// app.listen = function listen() {
//   var server = http.createServer(this);
//   return server.listen.apply(server, arguments);
// };
