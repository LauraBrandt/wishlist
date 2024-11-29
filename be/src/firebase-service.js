
const firebase = require('firebase-admin')

const { privateKey } = JSON.parse(process.env.FIREBASE_PRIVATE_KEY)

const firebaseCredentials = {
  "type": process.env.FIREBASE_TYPE,
  "project_id": process.env.FIREBASE_PROJECT_ID,
  "private_key_id": process.env.FIREBASE_PRIVATE_KEY_ID,
  "private_key": privateKey,
  "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  "client_id": process.env.FIREBASE_CLIENT_ID,
  "auth_uri": process.env.FIREBASE_AUTH_URI,
  "token_uri": process.env.FIREBASE_TOKEN_URI,
  "auth_provider_x509_cert_url": process.env.FIREBASE_AUTH_PROVIDER,
  "client_x509_cert_url": process.env.FIREBASE_CLIENT_CERT_URL,
  "universe_domain": process.env.FIREBASE_UNIVERSE_DOMAIN
}

firebase.initializeApp({
  credential: firebase.credential.cert(firebaseCredentials),
  databaseURL: 'https://wishlistfe.firebaseio.com',
})

module.exports = firebase
