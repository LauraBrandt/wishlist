const firebase = require('../firebase-service.js')

const getAuthToken = (request, response, next) => {
  const headerToken = request.headers.authorization
  if (!headerToken) {
    request.authToken = null
    return response.status(401).send({ message: 'No token provided' })
  } else if (headerToken.split(' ')[0] !== 'Bearer') {
    request.authToken = null
    response.status(401).send({ message: 'Invalid token' })
  } else {
    const token = headerToken.split(' ')[1]
    request.authToken = token
  }
  next()
}

const checkIfAuthenticated = (request, response, next) => {
  getAuthToken(request, response, async () => {
    try {
      const { authToken } = request
      const userInfo = await firebase.auth().verifyIdToken(authToken)
      request.authId = userInfo.uid
      return next()
    } catch (e) {
      return response.status(401).send({ error: 'Could not authorize' })
    }
  })
}

module.exports = checkIfAuthenticated
