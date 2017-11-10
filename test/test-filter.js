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
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` LIKE '%abc%' OR `table`.`column2` LIKE '%abc%')")
    })

    it('Add like mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` LIKE '%abc%' OR `table`.`column2` LIKE '%abc%')")
    })

    it('Add like postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" ILIKE \'%abc%\' OR "table"."column2" ILIKE \'%abc%\')')
    })

    it('Add like mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain("([table].[column1] LIKE N'%abc%' OR [table].[column2] LIKE N'%abc%')")
    })
  })

  describe('Not Like', () => {
    it('Add like sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addNotLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` NOT LIKE '%abc%' AND `table`.`column2` NOT LIKE '%abc%')")
    })

    it('Add like mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addNotLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` NOT LIKE '%abc%' AND `table`.`column2` NOT LIKE '%abc%')")
    })

    it('Add like postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addNotLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" NOT ILIKE \'%abc%\' AND "table"."column2" NOT ILIKE \'%abc%\')')
    })

    it('Add like mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addNotLike(['column1', 'column2'], 'abc')
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain("([table].[column1] NOT LIKE N'%abc%' AND [table].[column2] NOT LIKE N'%abc%')")
    })
  })

  describe('Equal integer', () => {
    it('Add equal sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addEqual('column1', 10)
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = 10)')
    })

    it('Add equal mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addEqual('column1', 10)
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = 10)')
    })

    it('Add equal postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addEqual('column1', 10)
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" = 10)')
    })

    it('Add equal mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addEqual('column1', 10)
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain('([table].[column1] = 10)')
    })
  })

  describe('Equal boolean', () => {
    it('Add equal sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addEqual('column1', true)
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = 1)')
    })

    it('Add equal mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addEqual('column1', true)
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` = true)')
    })

    it('Add equal postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addEqual('column1', true)
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" = true)')
    })

    it('Add equal mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addEqual('column1', true)
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain('([table].[column1] = 1)')
    })
  })

  describe('Equal datetime', () => {
    it('Add equal sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE)
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` = '2017-01-01 18:00:00.000 +00:00')")
    })

    it('Add equal mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE)
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` = '2017-01-01 18:00:00')")
    })

    it('Add equal postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE)
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" = \'2017-01-01 18:00:00.000 +00:00\')')
    })

    it('Add equal mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE)
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain("([table].[column1] = '2017-01-01 18:00:00.000 +00:00')")
    })
  })

  describe('Equal date', () => {
    it('Add equal sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` = '2017-01-01 00:00:00.000 +00:00')")
    })

    it('Add equal mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` = '2017-01-01 00:00:00')")
    })

    it('Add equal postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" = \'2017-01-01 00:00:00.000 +00:00\')')
    })

    it('Add equal mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain("([table].[column1] = '2017-01-01 00:00:00.000 +00:00')")
    })
  })

  describe('Not Equal boolean', () => {
    it('Add equal sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addNotEqual('column1', true, Sequelize.BOOLEAN)
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` IS NOT 1)')
    })

    it('Add equal mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addNotEqual('column1', true, Sequelize.BOOLEAN)
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain('(`table`.`column1` IS NOT true)')
    })

    it('Add equal postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addNotEqual('column1', true, Sequelize.BOOLEAN)
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" IS NOT true)')
    })

    it('Add equal mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addNotEqual('column1', true, Sequelize.BOOLEAN)
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain('([table].[column1] IS NOT 1)')
    })
  })

  describe('Not Equal date', () => {
    it('Add equal sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addNotEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` != '2017-01-01 00:00:00.000 +00:00')")
    })

    it('Add equal mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addNotEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` != '2017-01-01 00:00:00')")
    })

    it('Add equal postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addNotEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" != \'2017-01-01 00:00:00.000 +00:00\')')
    })

    it('Add equal mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addNotEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain("([table].[column1] != '2017-01-01 00:00:00.000 +00:00')")
    })
  })

  describe('Get where', () => {
    it('Get where sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addEqual('column1', 1)
      filter.addEqual('column2', 'test')
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` = 1 AND `table`.`column2` = 'test')")
    })

    it('Get where mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addEqual('column1', 1)
      filter.addEqual('column2', 'test')
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` = 1 AND `table`.`column2` = 'test')")
    })

    it('Get where postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addEqual('column1', 1)
      filter.addEqual('column2', 'test')
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" = 1 AND "table"."column2" = \'test\')')
    })

    it('Get where mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addEqual('column1', 1)
      filter.addEqual('column2', 'test')
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain("([table].[column1] = 1 AND [table].[column2] = N'test'")
    })
  })

  describe('Get where using or', () => {
    it('Get using or where sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addEqual('column1', 1)
      filter.addEqual('column2', 'test')
      let where = filter.getWhereUsingOr()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` = 1 OR `table`.`column2` = 'test')")
    })

    it('Get using or where mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addEqual('column1', 1)
      filter.addEqual('column2', 'test')
      let where = filter.getWhereUsingOr()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain("(`table`.`column1` = 1 OR `table`.`column2` = 'test')")
    })

    it('Get using or where postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addEqual('column1', 1)
      filter.addEqual('column2', 'test')
      let where = filter.getWhereUsingOr()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('("table"."column1" = 1 OR "table"."column2" = \'test\')')
    })

    it('Get using or where mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addEqual('column1', 1)
      filter.addEqual('column2', 'test')
      let where = filter.getWhereUsingOr()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain("([table].[column1] = 1 OR [table].[column2] = N'test'")
    })
  })

  describe('Sequelize Condition', () => {
    it('Add Op.overlap - sqlite', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addSequelizeCondition({
        column1: { [Sequelize.Op.overlap]: [1, 2] }
      })
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain(' ("table"."column1" && ARRAY[1,2])')
    })
  })

  describe('Annidate Filters', () => {
    it('Annidate or-block of conditions - sqlite', () => {
      let filter = new Filter(sqliteSupport.sequelize)
      filter.addLike(['column1'], 'test')
      let orBlock = new Filter(sqliteSupport.sequelize)
      orBlock.addEqual('column2', 'abc')
      orBlock.addEqual('column3', 5)
      filter.addSequelizeCondition(orBlock.getWhereUsingOr())
      let where = filter.getWhere()
      expect(sqliteSupport.getSql('table', {where: where})).to.contain("((`table`.`column1` LIKE '%test%') AND (`table`.`column2` = 'abc' OR `table`.`column3` = 5))")
    })

    it('Annidate or-block of conditions - mysql', () => {
      let filter = new Filter(mysqlSupport.sequelize)
      filter.addLike(['column1'], 'test')
      let orBlock = new Filter(mysqlSupport.sequelize)
      orBlock.addEqual('column2', 'abc')
      orBlock.addEqual('column3', 5)
      filter.addSequelizeCondition(orBlock.getWhereUsingOr())
      let where = filter.getWhere()
      expect(mysqlSupport.getSql('table', {where: where})).to.contain("((`table`.`column1` LIKE '%test%') AND (`table`.`column2` = 'abc' OR `table`.`column3` = 5))")
    })

    it('Annidate or-block of conditions - postgres', () => {
      let filter = new Filter(postgresSupport.sequelize)
      filter.addLike(['column1'], 'test')
      let orBlock = new Filter(postgresSupport.sequelize)
      orBlock.addEqual('column2', 'abc')
      orBlock.addEqual('column3', 5)
      filter.addSequelizeCondition(orBlock.getWhereUsingOr())
      let where = filter.getWhere()
      expect(postgresSupport.getSql('table', {where: where})).to.contain('(("table"."column1" ILIKE \'%test%\') AND ("table"."column2" = \'abc\' OR "table"."column3" = 5))')
    })

    it('Annidate or-block of conditions - mssql', () => {
      let filter = new Filter(mssqlSupport.sequelize)
      filter.addLike(['column1'], 'test')
      let orBlock = new Filter(mssqlSupport.sequelize)
      orBlock.addEqual('column2', 'abc')
      orBlock.addEqual('column3', 5)
      filter.addSequelizeCondition(orBlock.getWhereUsingOr())
      let where = filter.getWhere()
      expect(mssqlSupport.getSql('table', {where: where})).to.contain("(([table].[column1] LIKE N'%test%') AND ([table].[column2] = N'abc' OR [table].[column3] = 5))")
    })
  })
})
