'use strict'

const refService = require('./ref-service.js');

var FCM = require('fcm-node');
var serverKey = 'AAAAc3wbSuk:APA91bH3YsB9WjCcSztYW2Cnp26v6tFvFALWXor5wsDuoMQWDifCuEnOmz9hFryhW7FfunyRGMCIsDQmlA6f8AUj_uFQ-BihL_DJ2maMGqM6Vi_i1_w_c-Skys50w0fs7IeATrBHzBjB';

module.exports = {
  createPushNotification
}

function createPushNotification(db, requestData, fromUser) {
  var toUser = requestData.userId;
  console.log('recupero el token de usuario ', toUser)
  recuperandoToken(db, toUser)
    .then(function(token) {
      enviarNotificacionPush(token, requestData, fromUser);
    })
    .catch(function(err) {
      console.log(err);
    })
}

function enviarNotificacionPush(token, requestData, fromUser) {
  var fcm = new FCM(serverKey);

  var message = {
    to: token,

    notification: {
      title: 'Te han marcado un meme como favorito', 
      body: 'Nombre:' + requestData.slug + ' (clic para ver)',
      icon: `http://localhost:3001/img/avatar/${fromUser}.jpg`,
      "click_action": `http://localhost:8080/meme/${requestData.userId}/${requestData.slug}`
    }
  };

  fcm.send(message, function(err, response){
    if (err) {
        console.log("Intenté enviar notificaciones sin éxito a ", err);
    } else {
        console.log("Notificaciones enviadas: ", response);
    }
  });
}

function recuperandoToken(db, usuario) {
  return new Promise( (resolve, reject) => {
    let ref = db.ref(refService('pushNotifUserToken', usuario));
    ref.once('value', function(ss) {
      let token = ss.val();
      if(token) {
        resolve(token);
      } else {
        reject('No tenemos el token del usuario ' + usuario)
      }
    });
  });
}