
var admin = require('firebase-admin');

admin.initializeApp({
  credential: admin.credential.cert("./fir-3-curso-firebase-adminsdk-d98yq-48bbc19cd8.json"),
  databaseURL: "https://fir-3-curso.firebaseio.com"
});


var authService = admin.auth();

module.exports = (tokenid) => {
  return new Promise((resolve, reject) => {
    authService.verifyIdToken(tokenid)
      .then(function(decoded){
      console.log('user:', decoded);
        let uid = decoded.uid;

        //Tengo el id del usuario,
        //ahora compruebo qué cosas tiene este usuario para crear los correspondientes datos del token
        
        let customData = {
          admin: true
        }
        let customToken = authService.createCustomToken(uid, customData);
        resolve(customToken);
      })
      .catch(error => reject(error));
  });
}