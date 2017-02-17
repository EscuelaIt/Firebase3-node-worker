const refService = require('./ref-service');
const avatarService = require('../modules/avatar-service');

module.exports = function(admin) {
  var db = admin.database();
  var ref = db.ref(refService('userAll'));
  ref = ref.orderByChild('avatar').equalTo(null);
  ref.on('child_added', function(ss) {
    var user = ss.val();
    let userid = ss.key;
    console.log(user.name);
    savePrivateData(db, userid, user);
    saveAvatar(db, user.photoURL, userid);
  }, function(err) {
    console.log (err);
  });
}

function saveAvatar(db, image, userid) {
  avatarService.saveImage(image, userid)
    .then( destino => {
      let refAvatar = db.ref(refService('userAvatar', userid));
      refAvatar.set('http://localhost:3001/' + destino);
    })
    .catch( (err) => console.log('error al guardar la imagen de avatar: ', err));
}

function savePrivateData(db, userid, user) {
  let email = (user.email) ? user.email : '';
  let photoURL = (user.photoURL) ? user.photoURL : 'https://worker.desarrolloweb.es/img/avatar/_defaultavatar.jpg';
  let credential = (user.credential) ? user.credential : null;
  var privateData = {
    email: email,
    photoURL: photoURL,
    credential: credential
  };

  //console.log(datosPrivados);
  let refPrivate = db.ref(refService('userPrivateOne', userid));
  refPrivate.set(privateData)
    .then(() => {
      deletePrivateData(db, userid);
    });
}

function deletePrivateData(db, userid) {
  data = {
    email: null,
    photoURL: null,
    credential: null
  }
  let ref = db.ref(refService('userOne', userid));
  ref.update(data);
}
