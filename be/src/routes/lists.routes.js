const express = require('express')
const checkIfAuthenticated = require('./auth-middleware')
const router = express.Router()
const listController = require('../controllers/list.controller.js');
const itemController = require('../controllers/list_item.controller.js');
const noteController = require('../controllers/list_note.controller.js');

router.use('/', checkIfAuthenticated)
router.get('/', listController.getLists)
router.post('/', listController.createList)
router.use('/:listId', listController.checkIfHasAccessToList)
router.post('/:listId', listController.updateList)
router.delete('/:listId', listController.deleteList)

router.post('/:listId/items', itemController.createItems)
router.post('/:listId/items/:itemId([0-9]*)', itemController.updateItem)
router.delete('/:listId/items/:itemId([0-9]*)', itemController.deleteItem)
router.post('/:listId/notes', noteController.createNote)
router.post('/:listId/notes/:noteId([0-9]*)', noteController.updateNote)
router.delete('/:listId/notes/:noteId([0-9]*)', noteController.deleteNote)

module.exports = router
