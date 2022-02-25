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
    if (this.code === null) {
      this.code = parseInt(process.env.CODE_SUCCESS, 10)
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

  success(res, code = parseInt(process.env.CODE_SUCCESS, 10)) {
    console.log(process.env.CODE_SUCEESS)
    this.code = code
    this.json(res)
  }

  fail(res, code = parseInt(process.env.CODE_ERROR, 10)) {
    this.code = code
    this.json(res)
  }
}
module.exports = Result
