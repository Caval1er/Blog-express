const jwt = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('./redis')
module.exports = {
  signAccessToken: userId => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.ACCESS_TOKEN_SECRET
      const options = {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN,
        issuer: 'Caval1er',
        audience: userId,
      }
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) return reject(createError(500))
        resolve(token)
      })
    })
  },
  verifyAccessToken: (req, res, next) => {
    if (!req.headers.authorization)
      return next(createError(401, '不合法的用户凭证'))
    const authHeader = req.headers.authorization
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
      if (err) return next(createError(401, '不合法的用户凭证'))
      req.payload = payload
      next()
    })
  },
  signRefreshToken: userId => {
    return new Promise((resolve, reject) => {
      const payload = {}
      const secret = process.env.REFRESH_TOKEN_SECRET
      const options = {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRESIN,
        issuer: 'Caval1er',
        audience: userId,
      }
      jwt.sign(payload, secret, options, (err, token) => {
        if (err) return reject(createError(500))
        client
          .set(userId, token, {
            EX: 30 * 24 * 60 * 60,
          })
          .then()
          .catch(() => {
            reject(createError(500))
            return
          })
        resolve(token)
      })
    })
  },
  verifyRefreshToken: refreshToken => {
    return new Promise((resolve, reject) => {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, payload) => {
          if (err) return reject(createError(401))
          const userId = payload.aud
          client
            .get(userId)
            .then(result => {
              if (refreshToken === result) return resolve(userId)
              reject(createError(401))
              return
            })
            .catch(() => {
              reject(createError(500))
              return
            })
        }
      )
    })
  },
}
