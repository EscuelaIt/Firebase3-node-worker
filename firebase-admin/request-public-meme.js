'use strict'

const refService = require('./ref-service');

module.exports = (admin) => {
  var db = admin.database();
  var ref = db.ref(refService('requestPublicMemeAll'));

  ref.on('child_added', (ss) => {
    const userId = ss.key;
    const requestData = ss.val();

    console.log(`Request del usuario ${userId} de hacer un meme público: ${requestData.slug}`);

    //realizar todas las comprobaciones de seguridad para garantizar la integridad de la acción
    
    let refMemes = db.ref(refService('memesAll'));
    let refNewMeme = refMemes.push();
    refNewMeme.set({
      "userId": userId,
      "slug": requestData.slug
    })
      .then(() => {
        console.log('creado un registro en memes globales');
        anotarMemePublico(db, userId, requestData.slug, refNewMeme.key);
        borrarRequest(db, userId);
      })

  });

}

function anotarMemePublico(db, userId, slug, key) {
  const data = {
    isPublic: true,
    publicId: key
  }
  let ref = db.ref(refService('memesUserAll', userId)).child(slug);
  ref.update(data)
    .then(() => {
      console.log('Anotado como publico')
    });
}

function borrarRequest(db, userId) {
  let ref = db.ref(refService('requestPublicMemeAll')).child(userId);
  ref.remove()
    .then(() => {
      console.log('borrado el request');
    });
}