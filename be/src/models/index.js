const mongoose = require('mongoose')
mongoose.Promise = global.Promise

const db = {
  mongoose,
}

db.list = require('./list.model')(mongoose)
db.list_item = require('./list_item.model')(mongoose)
db.list_note = require('./list_note.model')(mongoose)

module.exports = db
