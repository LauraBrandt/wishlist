const express = require('express')
const router = express.Router()
const db = require('../models')
const User = db.user
const { currentUserId } = require('../../config')

router.get('/logged-in', function(req, res) {
  User.findById(currentUserId)
    .then(user => {
      const formattedUser = {
        id: user._id,
        name: user.name,
        list_edit_accesses: user.list_edit_accesses,
        list_view_accesses: user.list_view_accesses,
      }
      res.send(formattedUser)
    })
    .catch(err => {
      res.status(500).send({  message: err.message || 'An error occurred while retrieving the current user.', })
    })
})

module.exports = router
