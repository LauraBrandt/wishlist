const db = require('../models')
const ListNote = db.list_note

async function createNote(req, res) {
  try {
    const listId = req.params.listId
    const noteText = req.body.text
    const note = new ListNote({
      list: listId,
      text: noteText,
      user_id: req.currentUserId,
      user_name: req.currentUserName,
    })
    await note.save()
    res.end()
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while saving the note.' })
  }
}

async function updateNote(req, res) {
  try {
    const noteId = req.params.noteId
    const noteText = req.body.text
    await ListNote.findByIdAndUpdate(noteId, { text: noteText });
    res.end()
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while saving the note.' })
  }
}

async function deleteNote(req, res) {
  try {
    const noteId = req.params.noteId
    await ListNote.findByIdAndDelete(noteId)
    res.end()
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while deleting the note.' })
  }
}

module.exports = {
  createNote,
  updateNote,
  deleteNote,
}
