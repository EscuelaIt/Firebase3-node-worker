'use strict'

const refService = require('./ref-service');
const pushNotificationService = require('./push-notification-service');
const moment = require('moment');

module.exports = (admin) => {
  var db = admin.database();
  var ref = db.ref(refService('requestNotificationAll'));

  ref.on('child_added', (ss) => {
    const requestData = ss.val();
    const userId = ss.key
    console.log(`Request de notificación del usuario ${userId} tipo: ${requestData.type}`);
    
    //realizar todas las comprobaciones de seguridad para garantizar la integridad de la acción

    createSiteNotification(db, requestData, userId);
    pushNotificationService.createPushNotification(db, requestData, userId);
    deleteNotificationRequest(db, userId);
  });

}


function createSiteNotification(db, requestData, userId) {
  var notifObject = {
    user: userId,
    text: 'Marcó como favorito un meme',
    link: `/meme/${requestData.userId}/${requestData.slug}`,
    timestamp: moment().format('X'),
  }
  var ref = db.ref(refService('notificationsUser', requestData.userId));
  ref.push(notifObject);
}

function deleteNotificationRequest(db, uid) {
  var ref = db.ref(refService('requestNotificationAll')).child(uid);
  ref.remove();
}