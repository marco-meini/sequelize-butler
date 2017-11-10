'use strict'
/* global describe, it */

const Filter = require('../src/Filter')
const Support = require('./support')
const chai = require('chai')
const Sequelize = require('sequelize')
const expect = chai.expect

describe('Filter', () => {
  let supports = [new Support('mysql'), new Support('sqlite'), new Support('postgres'), new Support('mssql')]

  describe('Like', () => {
    it('Add like', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addLike(['column1', 'column2'], 'abc')
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` LIKE '%abc%' OR `table`.`column2` LIKE '%abc%')")
            break
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` LIKE '%abc%' OR `table`.`column2` LIKE '%abc%')")
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" ILIKE \'%abc%\' OR "table"."column2" ILIKE \'%abc%\')')
            break
          case 'mssql':
            expect(sql).to.contain("([table].[column1] LIKE N'%abc%' OR [table].[column2] LIKE N'%abc%')")
            break
        }
      })
    })

    it('Add Not like', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addNotLike(['column1', 'column2'], 'abc')
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` NOT LIKE '%abc%' AND `table`.`column2` NOT LIKE '%abc%')")
            break
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` NOT LIKE '%abc%' AND `table`.`column2` NOT LIKE '%abc%')")
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" NOT ILIKE \'%abc%\' AND "table"."column2" NOT ILIKE \'%abc%\')')
            break
          case 'mssql':
            expect(sql).to.contain("([table].[column1] NOT LIKE N'%abc%' AND [table].[column2] NOT LIKE N'%abc%')")
            break
        }
      })
    })
  })

  describe('Equal', () => {
    it('Integer', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addEqual('column1', 10)
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain('(`table`.`column1` = 10)')
            break
          case 'mysql':
            expect(sql).to.contain('(`table`.`column1` = 10)')
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = 10)')
            break
          case 'mssql':
            expect(sql).to.contain('([table].[column1] = 10)')
            break
        }
      })
    })

    it('Boolean', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addEqual('column1', true)
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain('(`table`.`column1` = 1)')
            break
          case 'mysql':
            expect(sql).to.contain('(`table`.`column1` = true)')
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = true)')
            break
          case 'mssql':
            expect(sql).to.contain('([table].[column1] = 1)')
            break
        }
      })
    })

    it('Datetime', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE)
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` = '2017-01-01 18:00:00.000 +00:00')")
            break
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` = '2017-01-01 18:00:00')")
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = \'2017-01-01 18:00:00.000 +00:00\')')
            break
          case 'mssql':
            expect(sql).to.contain("([table].[column1] = '2017-01-01 18:00:00.000 +00:00')")
            break
        }
      })
    })

    it('Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` = '2017-01-01 00:00:00.000 +00:00')")
            break
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` = '2017-01-01 00:00:00')")
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = \'2017-01-01 00:00:00.000 +00:00\')')
            break
          case 'mssql':
            expect(sql).to.contain("([table].[column1] = '2017-01-01 00:00:00.000 +00:00')")
            break
        }
      })
    })

    it('NOT boolean', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addNotEqual('column1', true, Sequelize.BOOLEAN)
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain('(`table`.`column1` IS NOT 1)')
            break
          case 'mysql':
            expect(sql).to.contain('(`table`.`column1` IS NOT true)')
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" IS NOT true)')
            break
          case 'mssql':
            expect(sql).to.contain('([table].[column1] IS NOT 1)')
            break
        }
      })
    })

    it('NOT Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addNotEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` != '2017-01-01 00:00:00.000 +00:00')")
            break
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` != '2017-01-01 00:00:00')")
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" != \'2017-01-01 00:00:00.000 +00:00\')')
            break
          case 'mssql':
            expect(sql).to.contain("([table].[column1] != '2017-01-01 00:00:00.000 +00:00')")
            break
        }
      })
    })
  })

  describe('Greater', () => {
    it('To Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addGreaterTo('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` > '2017-01-01 00:00:00.000 +00:00')")
            break
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` > '2017-01-01 00:00:00')")
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" > \'2017-01-01 00:00:00.000 +00:00\')')
            break
          case 'mssql':
            expect(sql).to.contain("([table].[column1] > '2017-01-01 00:00:00.000 +00:00')")
            break
        }
      })
    })

    it('Equal To Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addGreaterEqualTo('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` >= '2017-01-01 00:00:00.000 +00:00')")
            break
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` >= '2017-01-01 00:00:00')")
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" >= \'2017-01-01 00:00:00.000 +00:00\')')
            break
          case 'mssql':
            expect(sql).to.contain("([table].[column1] >= '2017-01-01 00:00:00.000 +00:00')")
            break
        }
      })
    })
  })

  describe('Where', () => {
    it('Get where', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addEqual('column1', 1)
        filter.addEqual('column2', 'test')
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` = 1 AND `table`.`column2` = 'test')")
            break
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` = 1 AND `table`.`column2` = 'test')")
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = 1 AND "table"."column2" = \'test\')')
            break
          case 'mssql':
            expect(sql).to.contain("([table].[column1] = 1 AND [table].[column2] = N'test'")
            break
        }
      })
    })

    it('Get where using or', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addEqual('column1', 1)
        filter.addEqual('column2', 'test')
        let where = filter.getWhereUsingOr()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` = 1 OR `table`.`column2` = 'test')")
            break
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` = 1 OR `table`.`column2` = 'test')")
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = 1 OR "table"."column2" = \'test\')')
            break
          case 'mssql':
            expect(sql).to.contain("([table].[column1] = 1 OR [table].[column2] = N'test'")
            break
        }
      })
    })
  })

  describe('Sequelize Condition', () => {
    it('Sequelize.Op.overlap', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addSequelizeCondition({
          column1: { [Sequelize.Op.overlap]: [1, 2] }
        })
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            break
          case 'mysql':
            break
          case 'postgres':
            expect(sql).to.contain('("table"."column1" && ARRAY[1,2])')
            break
          case 'mssql':
            break
        }
      })
    })
  })

  describe('Annidate Filters', () => {
    it('Annidate or-block of conditions', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize)
        filter.addLike(['column1'], 'test')
        let orBlock = new Filter(support.sequelize)
        orBlock.addEqual('column2', 'abc')
        orBlock.addEqual('column3', 5)
        filter.addSequelizeCondition(orBlock.getWhereUsingOr())
        let where = filter.getWhere()
        let sql = support.getSql('table', {where: where})
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("((`table`.`column1` LIKE '%test%') AND (`table`.`column2` = 'abc' OR `table`.`column3` = 5))")
            break
          case 'mysql':
            expect(sql).to.contain("((`table`.`column1` LIKE '%test%') AND (`table`.`column2` = 'abc' OR `table`.`column3` = 5))")
            break
          case 'postgres':
            expect(sql).to.contain('(("table"."column1" ILIKE \'%test%\') AND ("table"."column2" = \'abc\' OR "table"."column3" = 5))')
            break
          case 'mssql':
            expect(sql).to.contain("(([table].[column1] LIKE N'%test%') AND ([table].[column2] = N'abc' OR [table].[column3] = 5))")
            break
        }
      })
    })
  })
})
