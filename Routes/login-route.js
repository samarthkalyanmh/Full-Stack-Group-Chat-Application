const express = require('express')
const router = express.Router()

const userController = require('../Controllers/user-controller')

router.post('/user/login', userController.login)

module.exports = router