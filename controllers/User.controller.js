const createError = require('http-errors')
const UserModel = require('../models/User.model')
const Result = require('../models/Result.model')
const { authSchema } = require('../utils/validation_schema')
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} = require('../utils/jwt')
const client = require('../utils/redis')
module.exports = {
  // 注册
  register: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body)
      const { email, password } = result
      const isExist = await UserModel.findOne({ email })
      if (isExist) throw createError(409, `${email}已经被注册`)
      const user = new UserModel({ email, password })
      const registerUser = await user.save()
      if (!registerUser) throw createError(404, '注册失败')
      new Result('注册成功').success(res)
    } catch (error) {
      if (error.isJoi) return next(createError(400, '不合法的邮箱或密码'))
      next(error)
    }
  },
  // 登录
  login: async (req, res, next) => {
    try {
      const result = await authSchema.validateAsync(req.body)
      const { email, password } = result
      const user = await UserModel.findOne({ email })
      if (!user) throw createError(404, '没有找到用户')
      const isMathed = await user.isValidPassword(password)
      if (!isMathed) throw createError(401, '用户或者密码错误')
      const accessToken = await signAccessToken(user.id)
      const refreshToken = await signRefreshToken(user.id)
      new Result({ accessToken, refreshToken }, '登录成功').success(res)
    } catch (error) {
      if (error.isJoi) return next(createError(400, '不合法的邮箱或密码'))
      next(error)
    }
  },
  // 刷新token
  refreshToken: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError(400, '没有提供刷新凭证')
      const userId = await verifyRefreshToken(refreshToken)
      const accessToken = await signAccessToken(userId)
      const refToken = await signRefreshToken(userId)
      new Result(
        { accessToken, refreshToken: refToken },
        '刷新token成功'
      ).success(res)
    } catch (error) {
      next(error)
    }
  },
  // 登出
  logout: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError(400)
      const userId = await verifyRefreshToken(refreshToken)
      await client.del(userId)
      new Result('登出成功').success(res)
    } catch (error) {
      next(error)
    }
  },
  // 自动登录
  autoLogin: async (req, res, next) => {
    try {
      const { refreshToken } = req.body
      if (!refreshToken) throw createError(400)
      await verifyRefreshToken(refreshToken)
      new Result('自动登录').success(res)
    } catch (error) {
      next(error)
    }
  },

  // 获取用户信息
  getInfo: async (req, res, next) => {
    try {
      const userId = req.payload.aud
      const userInfo = await UserModel.findById(userId).select({ password: 0 })
      if (!userInfo) throw createError(404, '没有找到用户信息')
      new Result(userInfo, '返回用户信息').success(res)
    } catch (error) {
      next(error)
    }
  },
}
