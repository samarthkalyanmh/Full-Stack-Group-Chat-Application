const express = require('express')
const router = express.Router()

const chatController = require('../Controllers/chat-controller')
const authenticateUser = require('../Middleware/authenticate')

router.post('/chat/message', authenticateUser.authenticate, chatController.messageReceived)

router.get('/chat/getallchats', authenticateUser.authenticate, chatController.getAllChats)

module.exports = router