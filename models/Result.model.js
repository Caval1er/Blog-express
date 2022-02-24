class Result {
  constructor(data, message = 'success', options = null) {
    switch (arguments.length) {
      case 0:
        this.message = 'success'
        break
      case 1:
        this.message = data
        break
      case 2:
        this.data = data
        this.message = message
        break
      default:
        this.data = data
        this.message = message
        this.options = options
        break
    }
  }

  createResult() {
    if (!this.code) {
      this.code = process.env.CODE_SUCEESS
    }
    let base = {
      code: this.code,
      message: this.message,
    }
    if (this.data) {
      base.data = this.data
    }
    if (this.options) {
      base = { ...base, ...this.options }
    }
    return base
  }

  json(res) {
    res.json(this.createResult())
  }

  success(res, code = process.env.CODE_SUCCESS) {
    this.code = code
    this.json(res)
  }

  fail(res, code = process.env.CODE_ERROR) {
    this.code = code
    this.json(res)
  }
}
module.exports = Result
