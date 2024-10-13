const firebase = require('../firebase-service.js')

const getAuthToken = (req, res, next) => {
  const headerToken = req.headers.authorization
  if (!headerToken) {
    req.authToken = null
    return res.status(401).send({ message: 'No token provided' })
  } else if (headerToken.split(' ')[0] !== 'Bearer') {
    req.authToken = null
    res.status(401).send({ message: 'Invalid token' })
  } else {
    const token = headerToken.split(' ')[1]
    req.authToken = token
  }
  next()
}

const checkIfAuthenticated = (req, res, next) => {
  getAuthToken(req, res, async () => {
    try {
      const { authToken } = req
      const userInfo = await firebase.auth().verifyIdToken(authToken)
      req.currentUserId = userInfo.uid
      req.currentUserName = userInfo.displayName
      return next()
    } catch (e) {
      return res.status(401).send({ error: 'Could not authorize' })
    }
  })
}

module.exports = checkIfAuthenticated
