//librería para imágenes
const Jimp = require('jimp');

module.exports = {
  saveImage
}

function saveImage(imgURL, userId, reintentar = true) {
  return new Promise( (resolve, reject) => {
    Jimp.read(imgURL)
      .then( (img) => {
        console.log('imagen leida');
        let destino = `img/avatar/${userId}.jpg`;
        console.log('destino:', destino)
        img
          .resize(64, 64)
          .quality(60)
          .write(destino, function() {
            resolve(destino);
          });
        })
      .catch( (err) => {
        console.log('problema con la imagen (reintentar: ', reintentar, ')');
        if(reintentar) {
          console.log('intento con el avatar por defecto')
          saveImage('https://worker.desarrolloweb.es/img/avatar/_defaultavatar.jpg', userId, false)
            .then( destino => resolve(destino))
            .catch( (err) => {
              console.error('Dos intentos fallidos de crear la imagen')
              reject( err );
            });
        } else {
          reject( err );
        }
      });
  });
}