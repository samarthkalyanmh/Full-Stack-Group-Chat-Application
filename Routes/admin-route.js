const express = require('express')
const router = express.Router()

const authenticateUser = require('../Middleware/authenticate')
const adminController = require('../Controllers/admin-controller')

router.post('/admin/add-user', authenticateUser.authenticate, adminController.addUser)
router.post('/admin/make-user-admin', authenticateUser.authenticate, adminController.makeUserAdmin)
router.post('/admin/remove-user', authenticateUser.authenticate, adminController.removeUserFromGroup)


module.exports = router 