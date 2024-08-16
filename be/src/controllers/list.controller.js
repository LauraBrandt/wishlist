const db = require('../models')
const List = db.list
const ListItem = db.list_item
const ListNote = db.list_note

const getFormattedList = (list) => ({
  id: list._id,
  name: list.name,
})

const getFormattedItem = (item) => ({
  id: item._id,
  name: item.name,
  description: item.description,
  is_bought: item.is_bought,
})

const getFormattedNote = (note) => ({
  id: note._id,
  text: note.text,
  user: {
    id: note.user._id,
    name: note.user.name,
  }
})

const populateItems = (lists, items) => {
  const itemsByListId = {}
  items.forEach(item => {
    itemsByListId[item.list] = ( itemsByListId[item.list] || []).concat(getFormattedItem(item))
  })
  lists.forEach(list => {
    list.items = itemsByListId[list.id] || []
  })
}

const populateNotes = (lists, notes) => {
  const notesByListId = {}
  notes.forEach(note => {
    notesByListId[note.list] = ( notesByListId[note.list] || []).concat(getFormattedNote(note))
  })
  lists.forEach(list => {
    list.notes = notesByListId[list.id] || []
  })
}

async function getLists(req, res) {
  try {
    const items = await ListItem.find().exec()
    const notes = await ListNote.find().populate('user').exec()
    const lists = await List.find()
    const formattedLists = lists.map(getFormattedList)
    populateItems(formattedLists, items)
    populateNotes(formattedLists, notes)
    res.send(formattedLists)
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while retrieving the lists.' })
  }
}

module.exports = {
  getLists,
}
