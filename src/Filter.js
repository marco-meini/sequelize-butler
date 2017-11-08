'use strict'

const _ = require('lodash')
const Sequelize = require('sequelize')
const moment = require('moment')

const Filter = function (dialect) {
  let where = {}
  let conditions = []

  this.addLike = (columns, value) => {
    if (columns && columns.length && value && !_.isEmpty(value)) {
      let likeConditions = []
      columns.forEach((column) => {
        let condition = {}
        if (dialect === 'postgres') {
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
        if (dialect === 'postgres') {
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
          condition[column] = moment.utc(value).toDate()
          break
        case Sequelize.DATEONLY:
          value = moment.utc(value).startOf('day').toDate()
          condition[column] = moment.utc(value).toDate()
          break
        default:
          condition[column] = value
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

  this.getWhere = () => {
    if (conditions.length) {
      where = {
        [Sequelize.Op.and]: _.assign.apply(this, conditions)
      }
    }
    return where
  }

  this.getWhereUsingOr = () => {
    if (conditions.length) {
      where = {
        [Sequelize.Op.or]: _.assign.apply(this, conditions)
      }
    }
    return where
  }
}

module.exports = Filter
