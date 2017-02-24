'use strict'

const refService = require('./ref-service');
const twitterService = require('../twitter/twitter-service');
const base64 = require('node-base64-image');

module.exports = (admin) => {
  var db = admin.database();
  var ref = db.ref(refService('requestTwitterShareAll'));
  ref = ref.orderByChild('processed').equalTo(null);
  ref.on("child_added", (ss) => {
    let requestKey = ss.key;
    let requestData = ss.val();
    console.log('tengo un request: ', requestKey, requestData);
    let memeData, credentials;
    Promise.all([
      getMemeData(db, requestData.userId, requestData.slug),
      getTwitterCredentials(db, requestKey)
    ]).then(values => {
      console.log('recibidos values de la promesa All', values);
      memeData = values[0];
      credentials = values[1];
      let twitterClient = twitterService.getClient(credentials);
      getBase64(memeData.downloadURL)
      .then ( imgBase64 => twitterService.imagePost(twitterClient, imgBase64) )
      .then( image_id => twitterService.updatePost(twitterClient, memeData, image_id) )
      .then( () => sayProcessed(db, requestKey, false, 'El tuit se ha enviado') )
      .catch( err => {
        console.log('errorrrrrr:', err)
        sayProcessed(db, requestKey, true, err)       
      });
    })
    .catch( (err) => {
      console.log('Hay un error:', err);
      sayProcessed(db, requestKey, true, err) 
    })
  });
}

function getMemeData(db, userId, slug) {
  return new Promise( (resolve, reject) => {
    let ref = db.ref(refService('memesUserAll', userId)).child(slug);
    ref.once('value', (ss) => {
      let memeData = ss.val();
      if(!memeData) {
        reject('No se ha identificado el meme que se desea compartir');
      } else {
        resolve(memeData);
      }
    });
  });
} 

function deleteRequest(db, requestKey) {
  var ref = db.ref(refService('requestTwitterShareAll')).child(requestKey);
  ref.remove();
}

function sayProcessed(db, requestKey, err, msg) {
  var ref = db.ref(refService('requestTwitterResponseAll')).child(requestKey);
  ref.set({
    processed: true,
    error: err,
    msg: msg
  })
  .then( () => {
    deleteRequest(db, requestKey);
    console.log('Marcada como procesada ', requestKey, ' - Error:', err, ' - msg ', msg)
  });
}

function getBase64(url) {
  console.log('voy a obtener la base64 de ', url)
  return new Promise( (resolve, reject) => {
    base64.encode(url, { string: true}, (err, imageBase64) => {
      if (err) {
        console.log('error base64', err);
        reject(err);
      } else {
        console.log('guay base64', imageBase64);        
        resolve (imageBase64);
      }
    })
  });
}

function getTwitterCredentials(db, uid) {
  return new Promise( (resolve, reject) => {
    var ref = db.ref(refService('userCredentials', uid));
    ref.once('value', (ss) => {
      var credential = ss.val();
      if( !credential ) {
        reject('No tengo credentials')
      } else if( !credential.provider || credential.provider != 'twitter.com' ) {
        reject('No es una credential de Twitter')
      } else if( !credential.accessToken || !credential.secret) {
        reject('No tengo los datos necesarios en la credencial de Twitter')
      }
      resolve(credential);
    });
  });
}