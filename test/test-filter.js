'use strict'
/* global describe, it */

const Filter = require('../src/Filter')
const Support = require('./support')
const chai = require('chai')
const expect = chai.expect

describe('Filter', () => {
  let mysqlSupport = new Support('mysql')
  let sqliteSupport = new Support('sqlite')
  let postgresSupport = new Support('postgres')
  let mssqlSupport = new Support('mssql')

  describe('Like', () => {
    it('Add like sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize.getDialect())
      filter.addLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` LIKE '%abc%' OR `table`.`column2` LIKE '%abc%')")
    })

    it('Add like mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize.getDialect())
      filter.addLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` LIKE '%abc%' OR `table`.`column2` LIKE '%abc%')")
    })

    it('Add like postgres', () => {
      let filter = new Filter(postgresSupport.sequelize.getDialect())
      filter.addLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" ILIKE \'%abc%\' OR "table"."column2" ILIKE \'%abc%\')')
    })

    it('Add like mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize.getDialect())
      filter.addLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain("([table].[column1] LIKE N'%abc%' OR [table].[column2] LIKE N'%abc%')")
    })
  })

  describe('Equal', () => {
    it('Add equal sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize.getDialect())
      filter.addEqual('column1', 10)
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = 10)')
    })

    it('Add equal mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize.getDialect())
      filter.addEqual('column1', 10)
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = 10)')
    })

    it('Add equal postgres', () => {
      let filter = new Filter(postgresSupport.sequelize.getDialect())
      filter.addEqual('column1', 10)
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" = 10)')
    })

    it('Add equal mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize.getDialect())
      filter.addEqual('column1', 10)
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain('([table].[column1] = 10)')
    })
  })
})
