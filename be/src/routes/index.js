module.exports = app => {
  const listsRouter = require('./lists.routes')

  app.use('/lists', listsRouter)
}
