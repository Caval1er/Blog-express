const express = require('express')
const UserController = require('../controllers/User.controller')
const { verifyAccessToken } = require('../utils/jwt')
const router = express.Router()

router.get('/accessToken', verifyAccessToken, async (req, res, next) => {
  res.send('hh')
})
router.post('/refresh-token', UserController.refreshToken)

router.post('/register', UserController.register)
router.post('/login', UserController.login)
router.post('/logout', UserController.logout)
router.post('/auto-login', UserController.autoLogin)
module.exports = router
