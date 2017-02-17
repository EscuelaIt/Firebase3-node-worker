//iniciamos express
var express = require('express');
var app = express();

//configuro middleware para los archivos estáticos
const middleware = require('./modules/middleware');
middleware.useMiddleware(app, express);

//escuchar en el puerto indicado
app.listen(3001, function() {
  console.log('Servidor funcionando en http://localhost:' + 3001);
});

