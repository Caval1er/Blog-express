const express = require('express')
const UserController = require('../controllers/User.controller')
const { verifyAccessToken } = require('../utils/jwt')
const router = express.Router()

router.get('/accessToken', verifyAccessToken, async (req, res, next) => {
  res.send('hh')
})
router.post('/refreshToken', UserController.refreshToken)

router.post('/register', UserController.register)
router.post('/login', UserController.login)
module.exports = router
