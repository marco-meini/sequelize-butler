'use strict'

const Sequelize = require('sequelize')

const Support = function (dialect) {
  this.sequelize = new Sequelize({
    dialect: dialect,
    operatorsAliases: false
  })

  this.model = this.sequelize.define('table', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true
    },
    name: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    email: {
      type: Sequelize.TEXT,
      validate: {
        isEmail: {
          msg: 'Email is not valid'
        }
      }
    }
  })

  this.getSql = (table, options) => {
    let sql = this.sequelize.dialect.QueryGenerator
    return sql.selectQuery(table, options)
  }
}

module.exports = Support
