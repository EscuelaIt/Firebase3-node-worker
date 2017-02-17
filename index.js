
var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert("./fir-3-curso-firebase-adminsdk-d98yq-48bbc19cd8.json"),
  databaseURL: "https://fir-3-curso.firebaseio.com"
  // databaseAuthVariableOverride: {
  //   uid: "firebase-worker"
  // }
});

//worker gestion de altas de usuario
require('./firebase-admin/gestion-registro')(admin);


// var db = admin.database();
// var ref = db.ref('users');
// ref.on('child_added', function(ss) {
//   var user = ss.val();
//   console.log(user.name);
// }, function(err) {
//   console.log (err);
// });

