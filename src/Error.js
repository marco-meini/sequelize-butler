'use strict'

const SqError = function (error) {
  const Result = function (success, message) {
    this.success = success
    this.message = message
    this.subresults = []
  }

  const SubResult = function (success, message) {
    this.success = success
    this.message = message
  }

  this.isValidationError = () => {
    if (error.name === 'SequelizeValidationError') {
      return true
    }
    return false
  }

  this.getResults = (globalErrorMessage) => {
    if (this.isValidationError()) {
      let _result = new Result(false, globalErrorMessage)
      error.errors.forEach((item) => {
        _result.subresults.push(new SubResult(false, item.message))
      })
      return _result
    }
    return null
  }
}

module.exports = SqError
