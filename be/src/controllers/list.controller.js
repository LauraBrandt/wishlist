const db = require('../models')
const List = db.list
const ListItem = db.list_item
const ListNote = db.list_note

const getFormattedList = (list) => ({
  id: list._id,
  name: list.name,
  owner_id: list.owner_id,
  owner_can_view: list.owner_can_view,
})

const getFormattedItem = (item, canView) => {
  const ret = {
    id: item._id,
    name: item.name,
    description: item.description,
  }
  if (canView) {
    ret.is_bought = item.is_bought
  }
  return ret
}

const getFormattedNote = (note) => ({
  id: note._id,
  text: note.text,
  user_id: note.user_id,
  user_name: note.user_name,
})

const populateItems = (lists, items, listsById, currentUserId) => {
  const itemsByListId = {}
  items.forEach(item => {
    const itemList = listsById[item.list]
    const canView = itemList.owner_id !== currentUserId || itemList.owner_can_view
    itemsByListId[item.list] = ( itemsByListId[item.list] || []).concat(getFormattedItem(item, canView))
  })
  lists.forEach(list => {
    list.items = itemsByListId[list.id] || []
  })
}

const populateNotes = (lists, notes, listsById, currentUserId) => {
  const notesByListId = {}
  notes.forEach(note => {
    const noteList = listsById[note.list]
    const canView = noteList.owner_id !== currentUserId || noteList.owner_can_view
    if (canView) {
      notesByListId[note.list] = ( notesByListId[note.list] || []).concat(getFormattedNote(note))
    }
  })
  lists.forEach(list => {
    list.notes = notesByListId[list.id] || []
  })
}

async function getLists(req, res) {
  try {
    const items = await ListItem.find().exec()
    const notes = await ListNote.find().exec()
    const lists = await List.find()
    const listsById = {}
    lists.forEach(list => {
      listsById[list._id] = list
    })
    const formattedLists = lists.map(getFormattedList)
    populateItems(formattedLists, items, listsById, req.currentUserId)
    populateNotes(formattedLists, notes, listsById, req.currentUserId)
    res.send(formattedLists)
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while retrieving the lists.' })
  }
}

async function createList(req, res) {
  try {
    const list = new List({
      name: req.body.name,
      owner_id: req.currentUserId,
      owner_can_view: req.body.owner_can_view,
    })
    await list.save()
    res.end()
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while saving the list.' })
  }
}

async function updateList(req, res) {
  try {
    const listId = req.params.listId
    const toUpdate = {
      name: req.body.name,
    }
    await List.findByIdAndUpdate(listId, toUpdate);
    res.end()
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while saving the list.' })
  }
}

async function deleteList(req, res) {
  try {
    const listId = req.params.listId
    await List.findByIdAndDelete(listId)
    await ListItem.deleteMany({ list: listId })
    await ListNote.deleteMany({ list: listId })
    res.end()
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while deleting the list.' })
  }
}

async function checkIfHasAccessToList(req, res, next) {
  const listId = req.params.listId
  const list = await List.findById(listId)
  const listOwnerId = list.owner_id

  if (listOwnerId === req.currentUserId) {
    next()
  } else {
    res.status(403).send({ error: 'No access to list' })
  }
}

module.exports = {
  getLists,
  createList,
  updateList,
  deleteList,
  checkIfHasAccessToList,
}
