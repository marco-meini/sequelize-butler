'use strict'

const _ = require('lodash')
const Sequelize = require('sequelize')
const moment = require('moment')

const Filter = function (connection) {
  let conditions = []

  this.addLike = (columns, value) => {
    if (columns && columns.length && value && !_.isEmpty(value)) {
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
    if (columns && columns.length && value && !_.isEmpty(value)) {
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
          condition[column] = {
            [Sequelize.Op.eq]: moment.utc(value).toDate()
          }
          break
        case Sequelize.DATEONLY:
          value = moment.utc(value).startOf('day').toDate()
          condition[column] = {
            [Sequelize.Op.eq]: moment.utc(value).toDate()
          }
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
          condition[column] = {
            [Sequelize.Op.ne]: moment.utc(value).toDate()
          }
          break
        case Sequelize.DATEONLY:
          condition[column] = {
            [Sequelize.Op.ne]: moment.utc(value).startOf('day').toDate()
          }
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
          condition[column] = {
            [Sequelize.Op.gt]: moment.utc(value).toDate()
          }
          break
        case Sequelize.DATEONLY:
          value = moment.utc(value).startOf('day').toDate()
          condition[column] = {
            [Sequelize.Op.gt]: moment.utc(value).toDate()
          }
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
          condition[column] = {
            [Sequelize.Op.gte]: moment.utc(value).toDate()
          }
          break
        case Sequelize.DATEONLY:
          value = moment.utc(value).startOf('day').toDate()
          condition[column] = {
            [Sequelize.Op.gte]: moment.utc(value).toDate()
          }
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
          condition[column] = {
            [Sequelize.Op.lt]: moment.utc(value).toDate()
          }
          break
        case Sequelize.DATEONLY:
          value = moment.utc(value).startOf('day').toDate()
          condition[column] = {
            [Sequelize.Op.lt]: moment.utc(value).toDate()
          }
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
          condition[column] = {
            [Sequelize.Op.lte]: moment.utc(value).toDate()
          }
          break
        case Sequelize.DATEONLY:
          value = moment.utc(value).startOf('day').toDate()
          condition[column] = {
            [Sequelize.Op.lte]: moment.utc(value).toDate()
          }
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
            [Sequelize.Op.between]: [moment.utc(from).toDate(), moment.utc(to).toDate()]
          }
          break
        case Sequelize.DATEONLY:
          from = moment.utc(from).startOf('day').toDate()
          to = moment.utc(to).startOf('day').toDate()
          condition[column] = {
            [Sequelize.Op.between]: [moment.utc(from).toDate(), moment.utc(to).toDate()]
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
            [Sequelize.Op.notBetween]: [moment.utc(from).toDate(), moment.utc(to).toDate()]
          }
          break
        case Sequelize.DATEONLY:
          from = moment.utc(from).startOf('day').toDate()
          to = moment.utc(to).startOf('day').toDate()
          condition[column] = {
            [Sequelize.Op.notBetween]: [moment.utc(from).toDate(), moment.utc(to).toDate()]
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
