const path = require('path');

// Дает нам абсолютный путь до файла, кот. запускает приложение: app.js
module.exports = path.dirname(process.mainModule.filename);
