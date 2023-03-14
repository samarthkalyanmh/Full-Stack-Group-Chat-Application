const express = require('express')
const router = express.Router()

const userController = require('../Controllers/chat-controller')
const authenticateUser = require('../Middleware/authenticate')

router.post('/chat/message', authenticateUser.authenticate, userController.messageReceived)

module.exports = router