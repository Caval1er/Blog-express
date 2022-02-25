const mongoose = require('mongoose')
const { autoIncrement } = require('mongoose-plugin-autoinc')
const bcrypt = require('bcrypt')
const { Schema } = mongoose
const UserSchema = new Schema({
  email: { type: String, unique: true, required: true },
  nickname: { type: String, default: '用户' },
  password: { type: String, required: true },
  roles: [{ type: String, enum: ['visitor', 'editor', 'admin'] }],
  avatar: { type: String, default: '' },
})
UserSchema.plugin(autoIncrement, {
  model: 'User',
  field: 'userId',
  startAt: 1,
  incrementBy: 1,
})

UserSchema.pre('save', async function (next) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(this.password, salt)
    this.password = hashedPassword
    if (this.roles.indexOf('visitor') === -1) {
      this.roles.push('visitor')
    }
    next()
  } catch (error) {
    next(error)
  }
})
UserSchema.methods.isValidPassword = async function (password) {
  try {
    const isMathed = await bcrypt.compare(password, this.password)
    return isMathed
  } catch (error) {
    throw error
  }
}
const User = mongoose.model('User', UserSchema)
module.exports = User
