const {login,register,getAllUsers} = require('../controllers/auth')
const express = require('express')
const router = express.Router()

router.route('/login').post(login)
router.route('/register').post(register)
router.route('/getAllUsers').get(getAllUsers)

module.exports = router