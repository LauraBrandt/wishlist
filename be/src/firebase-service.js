
const firebase = require('firebase-admin')
const firebaseCredentials = require('../firebase-credentials.json')

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseCredentials),
  databaseURL: 'https://wishlistfe.firebaseio.com',
})

module.exports = firebase
