const db = require('../models')
const ListItem = db.list_item

async function createItems(req, res) {
  const listId = req.params.listId
  try {
    const newItems = req.body.map(item => new ListItem({
      list: listId,
      name: item.name,
      description: item.description,
    }))
    await ListItem.insertMany(newItems);
    res.end()
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while creating the items.' })
  }
}

async function updateItem(req, res) {
  try {
    const itemId = req.params.itemId
    const toUpdate = {
      name: req.body.name,
      description: req.body.description,
    }
    await ListItem.findByIdAndUpdate(itemId, toUpdate);
    res.end()
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while saving the item.' })
  }
}

async function deleteItem(req, res) {
  try {
    const itemId = req.params.itemId
    await ListItem.findByIdAndDelete(itemId)
    res.end()
  } catch(err) {
    res.status(500).send({ message: err.message || 'An error occurred while deleting the item.' })
  }
}

module.exports = {
  createItems,
  updateItem,
  deleteItem,
}
