
module.exports = (local, data = null) => {
  const refs = {
    userAll: () => '/users',
    userOne: (iduser) => `/users/${iduser}`,
    userAvatar: (iduser) => `/users/${iduser}/avatar`,
    userPrivateOne: (iduser) => `/userPrivateData/${iduser}`,
    memesAll: () => '/memes',
    memesUserAll: (uid) => `/memesUser/${uid}`,
    requestPublicMemeAll: () => '/requestPublicMeme',
    requestPrivateMemeAll: () => '/requestPrivateMeme',
    requestTwitterShareAll: () => '/twitter/shareRequest',
    requestTwitterResponseAll: () => '/twitter/shareResponse',
    requestNotificationAll: () => '/notificationRequest',
    notificationsUser: (uid) => `/notificationsUser/${uid}`,
    pushNotifUserToken: (iduser) => `/userTokenPush/${iduser}/token`,
    userCredentials: (uid) => `/userPrivateData/${uid}/credential`,
    memesUserFavsOne: (data) => `/memesUserFavs/${data.userId}/${data.slug}`,
  }
  return refs[local](data);
}
