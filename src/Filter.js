'use strict'

const _ = require('lodash')
const Sequelize = require('sequelize')
const moment = require('moment')

const Filter = function (connection) {
  let conditions = []
  let milliseconds = connection.getDialect() === 'mssql' ? 3 : 5

  this.addLike = (columns, value) => {
    if (columns && columns.length && value && !_.isEmpty(value) && _.isString(value)) {
      let likeConditions = []
      columns.forEach((column) => {
        let condition = {}
        if (connection.getDialect() === 'postgres') {
          condition[column] = {
            [Sequelize.Op.iLike]: '%' + value + '%'
          }
        } else {
          condition[column] = {
            [Sequelize.Op.like]: '%' + value + '%'
          }
        }
        likeConditions.push(condition)
      })
      conditions.push({ [Sequelize.Op.or]: _.assign.apply(this, likeConditions) })
    }
  }

  this.addNotLike = (columns, value) => {
    if (columns && columns.length && value && !_.isEmpty(value) && _.isString(value)) {
      let likeConditions = []
      columns.forEach((column) => {
        let condition = {}
        if (connection.getDialect() === 'postgres') {
          condition[column] = {
            [Sequelize.Op.notILike]: '%' + value + '%'
          }
        } else {
          condition[column] = {
            [Sequelize.Op.notLike]: '%' + value + '%'
          }
        }
        likeConditions.push(condition)
      })
      conditions.push({ [Sequelize.Op.and]: _.assign.apply(this, likeConditions) })
    }
  }

  this.addEqual = (column, value, type) => {
    if (column && value) {
      let condition = {}
      switch (type) {
        case Sequelize.DATE:
          let cast = connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME'
          condition = Sequelize.where(Sequelize.cast(column, cast), moment(value).format('YYYY-MM-DDTHH:mm:ss'))
          break
        case Sequelize.DATEONLY:
          condition = Sequelize.where(Sequelize.cast(column, 'DATE'), moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss'))
          break
        default:
          condition[column] = {
            [Sequelize.Op.eq]: value
          }
          break
      }
      conditions.push(condition)
    }
  }

  this.addNotEqual = (column, value, type) => {
    if (column && value) {
      let condition = {}
      switch (type) {
        case Sequelize.DATE:
          let cast = connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME'
          condition = Sequelize.where(Sequelize.cast(column, cast), { [Sequelize.Op.ne]: moment(value).format('YYYY-MM-DDTHH:mm:ss') })
          break
        case Sequelize.DATEONLY:
          condition = Sequelize.where(Sequelize.cast(column, 'DATE'), { [Sequelize.Op.ne]: moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss') })
          break
        case Sequelize.BOOLEAN:
          condition[column] = {
            [Sequelize.Op.not]: value
          }
          break
        default:
          condition[column] = {
            [Sequelize.Op.ne]: value
          }
          break
      }
      conditions.push(condition)
    }
  }

  this.addGreaterTo = (column, value, type) => {
    if (column && value) {
      let condition = {}
      switch (type) {
        case Sequelize.DATE:
          let cast = connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME'
          condition = Sequelize.where(Sequelize.cast(column, cast), { [Sequelize.Op.gt]: moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0')) })
          break
        case Sequelize.DATEONLY:
          condition = Sequelize.where(Sequelize.cast(column, 'DATE'), { [Sequelize.Op.gt]: moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0')) })
          break
        default:
          condition[column] = {
            [Sequelize.Op.gt]: value
          }
          break
      }
      conditions.push(condition)
    }
  }

  this.addGreaterEqualTo = (column, value, type) => {
    if (column && value) {
      let condition = {}
      switch (type) {
        case Sequelize.DATE:
          let cast = connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME'
          condition = Sequelize.where(Sequelize.cast(column, cast), { [Sequelize.Op.gte]: moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0')) })
          break
        case Sequelize.DATEONLY:
          condition = Sequelize.where(Sequelize.cast(column, 'DATE'), { [Sequelize.Op.gte]: moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0')) })
          break
        default:
          condition[column] = {
            [Sequelize.Op.gte]: value
          }
          break
      }
      conditions.push(condition)
    }
  }

  this.addLessTo = (column, value, type) => {
    if (column && value) {
      let condition = {}
      switch (type) {
        case Sequelize.DATE:
          let cast = connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME'
          condition = Sequelize.where(Sequelize.cast(column, cast), { [Sequelize.Op.lt]: moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0')) })
          break
        case Sequelize.DATEONLY:
          condition = Sequelize.where(Sequelize.cast(column, 'DATE'), { [Sequelize.Op.lt]: moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0')) })
          break
        default:
          condition[column] = {
            [Sequelize.Op.lt]: value
          }
          break
      }
      conditions.push(condition)
    }
  }

  this.addLessEqualTo = (column, value, type) => {
    if (column && value) {
      let condition = {}
      switch (type) {
        case Sequelize.DATE:
          let cast = connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME'
          condition = Sequelize.where(Sequelize.cast(column, cast), { [Sequelize.Op.lte]: moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0')) })
          break
        case Sequelize.DATEONLY:
          condition = Sequelize.where(Sequelize.cast(column, 'DATE'), { [Sequelize.Op.lte]: moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0')) })
          break
        default:
          condition[column] = {
            [Sequelize.Op.lte]: value
          }
          break
      }
      conditions.push(condition)
    }
  }

  this.addBetween = (column, from, to, type) => {
    if (column && from && to && typeof (from) === typeof (to)) {
      let condition = {}
      switch (type) {
        case Sequelize.DATE:
          condition[column] = {
            [Sequelize.Op.between]: [
              moment(from).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0')),
              moment(to).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '9'))
            ]
          }
          break
        case Sequelize.DATEONLY:
          from = moment(from).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0'))
          to = moment(to).endOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '9'))
          condition[column] = {
            [Sequelize.Op.between]: [from, to]
          }
          break
        default:
          condition[column] = {
            [Sequelize.Op.between]: [from, to]
          }
          break
      }
      conditions.push(condition)
    }
  }

  this.addNotBetween = (column, from, to, type) => {
    if (column && from && to && typeof (from) === typeof (to)) {
      let condition = {}
      switch (type) {
        case Sequelize.DATE:
          condition[column] = {
            [Sequelize.Op.notBetween]: [
              moment(from).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0')),
              moment(to).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '9'))
            ]
          }
          break
        case Sequelize.DATEONLY:
          from = moment(from).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0'))
          to = moment(to).endOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '9'))
          condition[column] = {
            [Sequelize.Op.notBetween]: [from, to]
          }
          break
        default:
          condition[column] = {
            [Sequelize.Op.notBetween]: [from, to]
          }
          break
      }
      conditions.push(condition)
    }
  }

  this.addIn = (column, values, type) => {
    if (column && values && values.length) {
      let condition = {}
      switch (type) {
        case Sequelize.DATE:
          let cast = connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME'
          condition = Sequelize.where(Sequelize.cast(column, cast), {
            [Sequelize.Op.in]: values.map((value) => {
              return moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0'))
            })
          })
          break
        case Sequelize.DATEONLY:
          condition = Sequelize.where(Sequelize.cast(column, 'DATE'), {
            [Sequelize.Op.in]: values.map((value) => {
              return moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0'))
            })
          })
          break
        default:
          condition[column] = {
            [Sequelize.Op.in]: values
          }
          break
      }
      conditions.push(condition)
    }
  }

  this.addNotIn = (column, values, type) => {
    if (column && values && values.length) {
      let condition = {}
      switch (type) {
        case Sequelize.DATE:
          let cast = connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME'
          condition = Sequelize.where(Sequelize.cast(column, cast), {
            [Sequelize.Op.notIn]: values.map((value) => {
              return moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0'))
            })
          })
          break
        case Sequelize.DATEONLY:
          condition = Sequelize.where(Sequelize.cast(column, 'DATE'), {
            [Sequelize.Op.notIn]: values.map((value) => {
              return moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', milliseconds, '0'))
            })
          })
          break
        default:
          condition[column] = {
            [Sequelize.Op.in]: values
          }
          break
      }
      conditions.push(condition)
    }
  }

  this.addSequelizeCondition = (condition) => {
    conditions.push(condition)
  }

  this.getWhere = () => {
    if (conditions.length) {
      return {
        [Sequelize.Op.and]: conditions
      }
    }
    return {}
  }

  this.getWhereUsingOr = () => {
    if (conditions.length) {
      return {
        [Sequelize.Op.or]: conditions
      }
    }
    return {}
  }
}

module.exports = Filter
