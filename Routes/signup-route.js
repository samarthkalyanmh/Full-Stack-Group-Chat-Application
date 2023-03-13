const express = require('express')
const router = express.Router()

const userController = require('../Controllers/user-controller')

router.post('/user/signup', userController.signup)

module.exports = router