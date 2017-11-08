'use strict'
/* global describe, it */

const Filter = require('../src/Filter')
const Support = require('./support')
const chai = require('chai')
const Sequelize = require('sequelize')
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

  describe('Equal integer', () => {
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

  describe('Equal boolean', () => {
    it('Add equal sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize.getDialect())
      filter.addEqual('column1', true)
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = 1)')
    })

    it('Add equal mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize.getDialect())
      filter.addEqual('column1', true)
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = true)')
    })

    it('Add equal postgres', () => {
      let filter = new Filter(postgresSupport.sequelize.getDialect())
      filter.addEqual('column1', true)
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" = true)')
    })

    it('Add equal mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize.getDialect())
      filter.addEqual('column1', true)
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain('([table].[column1] = 1)')
    })
  })

  describe('Equal datetime', () => {
    it('Add equal sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize.getDialect())
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE)
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = \'2017-01-01 18:00:00.000 +00:00\')')
    })

    it('Add equal mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize.getDialect())
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE)
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = \'2017-01-01 18:00:00\')')
    })

    it('Add equal postgres', () => {
      let filter = new Filter(postgresSupport.sequelize.getDialect())
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE)
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" = \'2017-01-01 18:00:00.000 +00:00\')')
    })

    it('Add equal mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize.getDialect())
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE)
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain('([table].[column1] = \'2017-01-01 18:00:00.000 +00:00\')')
    })
  })

  describe('Equal date', () => {
    it('Add equal sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize.getDialect())
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = \'2017-01-01 00:00:00.000 +00:00\')')
    })

    it('Add equal mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize.getDialect())
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = \'2017-01-01 00:00:00\')')
    })

    it('Add equal postgres', () => {
      let filter = new Filter(postgresSupport.sequelize.getDialect())
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" = \'2017-01-01 00:00:00.000 +00:00\')')
    })

    it('Add equal mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize.getDialect())
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain('([table].[column1] = \'2017-01-01 00:00:00.000 +00:00\')')
    })
  })
})
