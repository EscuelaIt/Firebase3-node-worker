module.exports.useMiddleware = (app, express) => {
  //sirvo archivos estáticos de las imágenes de avatares
  app.use('/img/avatar', express.static('img/avatar'));
}