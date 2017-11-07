'use strict'

const Sequelize = require('sequelize')
const path = require('path')

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.resolve('./test/model/test.sqlite')
})

const model = sequelize.define('tests', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  column1: {
    type: Sequelize.TEXT
  },
  column2: {
    type: Sequelize.TEXT
  }
}, {
  timestamps: false
})

const getSql = (options) => {
  let sql = sequelize.dialect.QueryGenerator
  return sql.selectQuery('tests', options)
}

module.exports = {
  sequelize: sequelize,
  model: model,
  getSql: getSql
}
