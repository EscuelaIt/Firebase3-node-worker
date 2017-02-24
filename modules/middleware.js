module.exports.useMiddleware = (app, express) => {
  //sirvo archivos estáticos de las imágenes de avatares
  app.use('/img/avatar', express.static('img/avatar'));

  app.use('/token', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, authtoken");
    next();
  });
}