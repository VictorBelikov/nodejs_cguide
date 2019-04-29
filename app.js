const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));

// Позволяет обслуживать статические(кот.не обслуж. маршрутами) файлы
// в указ.дериктории
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

// Если ни один из маршрутов не будет обработан
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, './views/404.html'));
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
