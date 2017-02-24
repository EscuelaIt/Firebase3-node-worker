//servicio de creación del token
const creatingCustomToken = require('./firebase-admin/custom-token');


module.exports = (app) => {

  app.get('/token', (req, res) => {
    let tokenRecived = req.headers['authtoken'];
    if (tokenRecived){
      const token = JSON.parse(tokenRecived);

      creatingCustomToken(token.accessToken)
          .then(function(customTokenGenerated) {
            res.send(customTokenGenerated);
          })
          .catch(error => {
            console.log(error);
            res.send("no se ha podido verificar el usuario");
          });

    } else {
      res.send('No se ha recibido el token');
    }
  });

}