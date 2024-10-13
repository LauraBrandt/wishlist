const express = require('express')
const checkIfAuthenticated = require('./auth-middleware')
const router = express.Router()
const listController = require('../controllers/list.controller.js');
const itemController = require('../controllers/list_item.controller.js');
const noteController = require('../controllers/list_note.controller.js');

router.use('/', checkIfAuthenticated)
router.get('/', listController.getLists)
router.post('/', listController.createList)
router.post('/:listId', listController.checkIfHasAccessToList, listController.updateList)
router.delete('/:listId', listController.checkIfHasAccessToList, listController.deleteList)

router.post('/:listId/items', listController.checkIfHasAccessToList, itemController.createItems)
router.post('/:listId/items/:itemId([0-9]*)/update', listController.checkIfHasAccessToList, itemController.updateItem)
router.post('/:listId/items/:itemId([0-9]*)/is_bought', listController.checkIfHasStatusAccessToList, itemController.updateIsBought)
router.delete('/:listId/items/:itemId([0-9]*)', listController.checkIfHasAccessToList, itemController.deleteItem)
router.post('/:listId/notes', listController.checkIfHasStatusAccessToList, noteController.createNote)
router.post('/:listId/notes/:noteId([0-9]*)', listController.checkIfHasStatusAccessToList, noteController.checkIfHasAccessToNote, noteController.updateNote)
router.delete('/:listId/notes/:noteId([0-9]*)', listController.checkIfHasStatusAccessToList, noteController.checkIfHasAccessToNote, noteController.deleteNote)

module.exports = router
