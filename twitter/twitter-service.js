const Twitter = require('twitter');

module.exports = {
  imagePost,
  updatePost,
  getClient
}

function imagePost(client, imgBase64) {
  console.log('voy a postear la imagen');
  return new Promise( (resolve, reject) => {
    client.post('media/upload', {media_data: imgBase64},  function(err, media, response) {
      if(err) {
        console.log('error al postear la imagen a twitter', err);
        reject(err);
      } else {
        console.log('todo bien al postear la imagen a twitter', media.media_id_string);
        resolve(media.media_id_string);
      }
    });
  });
}

function updatePost(client, memeData, media_id) {
  console.log('voy a tuitear algo', memeData, media_id);
  return new Promise( (resolve, reject) => {
    client.post('statuses/update', {status: memeData.name, media_ids: media_id},  function(err, tweet, response) {
      if(err) {
        console.log('error al postear update a twitter', err);        
        reject(err);
      } else {
        console.log('Todo bien al postear update a twitter');                
        resolve();
      }
    });
  });
}

function getClient(credentials) {
  return new Twitter({
    consumer_key: 'uO0RhZ58mQrbOFVjvxgYAIznT',
    consumer_secret: 'hr4MKG8DRFMZMUvwfjBcTaG7jfUJoKtZVKhZZnuCLYevL5xP4w',
    access_token_key: credentials.accessToken,
    access_token_secret: credentials.secret
  });
}
