module.exports = app => {
  const listsRouter = require('./lists.routes')
  const usersRouter = require('./users.routes')

  app.use('/lists', listsRouter)
  app.use('/users', usersRouter)
}
