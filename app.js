const createError = require('http-errors')
const express = require('express')
const path = require('path')
const logger = require('morgan')
require('dotenv').config()
require('./utils/mongodb')()
const indexRouter = require('./routes/index')

const app = express()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  next(createError(404, '接口不存在'))
})
// error handler
app.use((err, req, res, next) => {
  // render the error page
  res.status(err.status || 500).json({
    code: process.env.CODE_ERROR,
    message: (err && err.message) || '服务端错误',
    error: err.status || 500,
  })
})

module.exports = app
