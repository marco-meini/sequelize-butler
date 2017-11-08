'use strict'

const Sequelize = require('sequelize')

const Support = function (dialect) {
  this.sequelize = new Sequelize({
    dialect: dialect,
    operatorsAliases: false
  })

  this.getSql = (table, options) => {
    let sql = this.sequelize.dialect.QueryGenerator
    return sql.selectQuery(table, options)
  }
}

module.exports = Support
