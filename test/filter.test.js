'use strict';
/* global describe, it */

const Filter = require('../dist/Filter').Filter;
const Support = require('./support');
const chai = require('chai');
const Sequelize = require('sequelize');
const expect = chai.expect;

describe('Filter', () => {
  let supports = [new Support('mysql'), new Support('sqlite'), new Support('postgres'), new Support('mssql')];

  describe('Like', () => {
    it('Add like', (done) => {
      try {
        for (let support of supports) {
          let filter = new Filter(support.sequelize);
          filter.addLike(['column1', 'column2'], '%abc%');
          let where = filter.getWhere();
          let sql = support.getSql("table", { where: where });
          switch (support.sequelize.getDialect()) {
            case 'sqlite':
              expect(sql).to.contain("(`table`.`column1` LIKE '%abc%' OR `table`.`column2` LIKE '%abc%')");
              break;
            case 'mysql':
              expect(sql).to.contain("(`table`.`column1` LIKE '%abc%' OR `table`.`column2` LIKE '%abc%')");
              break;
            case 'postgres':
              expect(sql).to.contain('("table"."column1" ILIKE \'%abc%\' OR "table"."column2" ILIKE \'%abc%\')');
              break;
            case 'mssql':
              expect(sql).to.contain("([table].[column1] LIKE N'%abc%' OR [table].[column2] LIKE N'%abc%')");
              break;
          }
        }
        done();
      }
      catch (e) {
        done(e);
      }
    });

    it('Add Not like', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addNotLike(['column1', 'column2'], '%abc%');
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` NOT LIKE '%abc%' AND `table`.`column2` NOT LIKE '%abc%')");
            break;
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` NOT LIKE '%abc%' AND `table`.`column2` NOT LIKE '%abc%')");
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" NOT ILIKE \'%abc%\' AND "table"."column2" NOT ILIKE \'%abc%\')');
            break;
          case 'mssql':
            expect(sql).to.contain("([table].[column1] NOT LIKE N'%abc%' AND [table].[column2] NOT LIKE N'%abc%')");
            break;
        }
      });
    });
  });

  describe('Equal', () => {
    it('Integer', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addEqual('column1', 10);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain('(`table`.`column1` = 10)');
            break;
          case 'mysql':
            expect(sql).to.contain('(`table`.`column1` = 10)');
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = 10)');
            break;
          case 'mssql':
            expect(sql).to.contain('([table].[column1] = 10)');
            break;
        }
      });
    });

    it('String empty', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addEqual('column1', '');
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain('(`table`.`column1` = \'\')');
            break;
          case 'mysql':
            expect(sql).to.contain('(`table`.`column1` = \'\')');
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = \'\')');
            break;
          case 'mssql':
            expect(sql).to.contain('([table].[column1] = N\'\')');
            break;
        }
      });
    });

    it('Boolean', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addEqual('column1', true);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain('(`table`.`column1` = 1)');
            break;
          case 'mysql':
            expect(sql).to.contain('(`table`.`column1` = true)');
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = true)');
            break;
          case 'mssql':
            expect(sql).to.contain('([table].[column1] = 1)');
            break;
        }
      });
    });

    it('Datetime', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(CAST(`column1` AS DATETIME) = '2017-01-01T18:00:00')");
            break;
          case 'mysql':
            expect(sql).to.contain("(CAST(`column1` AS DATETIME) = '2017-01-01T18:00:00')");
            break;
          case 'postgres':
            expect(sql).to.contain("(CAST(\"column1\" AS TIMESTAMP(0)) = '2017-01-01T18:00:00')");
            break;
          case 'mssql':
            expect(sql).to.contain("(CAST([column1] AS DATETIME) = N'2017-01-01T18:00:00')");
            break;
        }
      });
    });

    it('Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(CAST(`column1` AS DATE) = '2017-01-01T00:00:00')");
            break;
          case 'mysql':
            expect(sql).to.contain("(CAST(`column1` AS DATE) = '2017-01-01T00:00:00')");
            break;
          case 'postgres':
            expect(sql).to.contain("(CAST(\"column1\" AS DATE) = '2017-01-01T00:00:00')");
            break;
          case 'mssql':
            expect(sql).to.contain("(CAST([column1] AS DATE) = N'2017-01-01T00:00:00')");
            break;
        }
      });
    });

    it('NOT String empty', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addNotEqual('column1', '');
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain('(`table`.`column1` != \'\')');
            break;
          case 'mysql':
            expect(sql).to.contain('(`table`.`column1` != \'\')');
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" != \'\')');
            break;
          case 'mssql':
            expect(sql).to.contain('([table].[column1] != N\'\')');
            break;
        }
      });
    });

    it('NOT boolean', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addNotEqual('column1', true, Sequelize.BOOLEAN);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain('(`table`.`column1` IS NOT 1)');
            break;
          case 'mysql':
            expect(sql).to.contain('(`table`.`column1` IS NOT true)');
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" IS NOT true)');
            break;
          case 'mssql':
            expect(sql).to.contain('([table].[column1] IS NOT 1)');
            break;
        }
      });
    });

    it('NOT Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addNotEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(CAST(`column1` AS DATE) != '2017-01-01T00:00:00')");
            break;
          case 'mysql':
            expect(sql).to.contain("(CAST(`column1` AS DATE) != '2017-01-01T00:00:00')");
            break;
          case 'postgres':
            expect(sql).to.contain("(CAST(\"column1\" AS DATE) != '2017-01-01T00:00:00')");
            break;
          case 'mssql':
            expect(sql).to.contain("(CAST([column1] AS DATE) != N'2017-01-01T00:00:00')");
            break;
        }
      });
    });

    it('Is null', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addEqual('column1', null);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` IS NULL)");
            break;
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` IS NULL)");
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" IS NULL)');
            break;
          case 'mssql':
            expect(sql).to.contain("([table].[column1] IS NULL)");
            break;
        }
      });
    });

    it('Is not null', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addNotEqual('column1', null);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` IS NOT NULL)");
            break;
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` IS NOT NULL)");
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" IS NOT NULL)');
            break;
          case 'mssql':
            expect(sql).to.contain("([table].[column1] IS NOT NULL)");
            break;
        }
      });
    });
  });

  describe('Between', () => {
    it('Integer', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addBetween('column1', 1, 2);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain('(`table`.`column1` BETWEEN 1 AND 2)');
            break;
          case 'mysql':
            expect(sql).to.contain('(`table`.`column1` BETWEEN 1 AND 2)');
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" BETWEEN 1 AND 2)');
            break;
          case 'mssql':
            expect(sql).to.contain('([table].[column1] BETWEEN 1 AND 2)');
            break;
        }
      });
    });

    it('Datetime', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addBetween('column1', '2017-01-01 18:00', '2017-01-01 19:00', Sequelize.DATE);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` BETWEEN '2017-01-01T18:00:00.00000' AND '2017-01-01T19:00:00.99999')");
            break;
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` BETWEEN '2017-01-01T18:00:00.00000' AND '2017-01-01T19:00:00.99999')");
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" BETWEEN \'2017-01-01T18:00:00.00000\' AND \'2017-01-01T19:00:00.99999\')');
            break;
          case 'mssql':
            expect(sql).to.contain("([table].[column1] BETWEEN N'2017-01-01T18:00:00.000' AND N'2017-01-01T19:00:00.999')");
            break;
        }
      });
    });

    it('Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addBetween('column1', '2017-01-01 18:00', '2017-01-02 19:00', Sequelize.DATEONLY);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` BETWEEN '2017-01-01T00:00:00.00000' AND '2017-01-02T23:59:59.99999')");
            break;
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` BETWEEN '2017-01-01T00:00:00.00000' AND '2017-01-02T23:59:59.99999')");
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" BETWEEN \'2017-01-01T00:00:00.00000\' AND \'2017-01-02T23:59:59.99999\')');
            break;
          case 'mssql':
            expect(sql).to.contain("([table].[column1] BETWEEN N'2017-01-01T00:00:00.000' AND N'2017-01-02T23:59:59.999')");
            break;
        }
      });
    });

    it('NOT Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addNotBetween('column1', '2017-01-01 18:00', '2017-01-02 19:00', Sequelize.DATEONLY);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` NOT BETWEEN '2017-01-01T00:00:00.00000' AND '2017-01-02T23:59:59.99999')");
            break;
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` NOT BETWEEN '2017-01-01T00:00:00.00000' AND '2017-01-02T23:59:59.99999')");
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" NOT BETWEEN \'2017-01-01T00:00:00.00000\' AND \'2017-01-02T23:59:59.99999\')');
            break;
          case 'mssql':
            expect(sql).to.contain("([table].[column1] NOT BETWEEN N'2017-01-01T00:00:00.000' AND N'2017-01-02T23:59:59.999')");
            break;
        }
      });
    });
  });

  describe('Greater', () => {
    it('To Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addGreaterTo('column1', '2017-01-01 18:00', Sequelize.DATEONLY);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(CAST(`column1` AS DATE) > '2017-01-01T00:00:00.00000')");
            break;
          case 'mysql':
            expect(sql).to.contain("(CAST(`column1` AS DATE) > '2017-01-01T00:00:00.00000')");
            break;
          case 'postgres':
            expect(sql).to.contain("(CAST(\"column1\" AS DATE) > '2017-01-01T00:00:00.00000')");
            break;
          case 'mssql':
            expect(sql).to.contain("(CAST([column1] AS DATE) > N'2017-01-01T00:00:00.000')");
            break;
        }
      });
    });

    it('Equal To Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addGreaterEqualTo('column1', '2017-01-01 18:00', Sequelize.DATEONLY);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(CAST(`column1` AS DATE) >= '2017-01-01T00:00:00.00000')");
            break;
          case 'mysql':
            expect(sql).to.contain("(CAST(`column1` AS DATE) >= '2017-01-01T00:00:00.00000')");
            break;
          case 'postgres':
            expect(sql).to.contain("(CAST(\"column1\" AS DATE) >= '2017-01-01T00:00:00.00000')");
            break;
          case 'mssql':
            expect(sql).to.contain("(CAST([column1] AS DATE) >= N'2017-01-01T00:00:00.000')");
            break;
        }
      });
    });
  });

  describe('Less', () => {
    it('To Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addLessTo('column1', '2017-01-01 18:00', Sequelize.DATEONLY);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(CAST(`column1` AS DATE) < '2017-01-01T00:00:00.00000')");
            break;
          case 'mysql':
            expect(sql).to.contain("(CAST(`column1` AS DATE) < '2017-01-01T00:00:00.00000')");
            break;
          case 'postgres':
            expect(sql).to.contain("(CAST(\"column1\" AS DATE) < '2017-01-01T00:00:00.00000')");
            break;
          case 'mssql':
            expect(sql).to.contain("(CAST([column1] AS DATE) < N'2017-01-01T00:00:00.000')");
            break;
        }
      });
    });

    it('Equal To Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addLessEqualTo('column1', '2017-01-01 18:00', Sequelize.DATEONLY);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(CAST(`column1` AS DATE) <= '2017-01-01T00:00:00.00000')");
            break;
          case 'mysql':
            expect(sql).to.contain("(CAST(`column1` AS DATE) <= '2017-01-01T00:00:00.00000')");
            break;
          case 'postgres':
            expect(sql).to.contain("(CAST(\"column1\" AS DATE) <= '2017-01-01T00:00:00.00000')");
            break;
          case 'mssql':
            expect(sql).to.contain("(CAST([column1] AS DATE) <= N'2017-01-01T00:00:00.000')");
            break;
        }
      });
    });
  });

  describe('Where', () => {
    it('Get where', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addEqual('column1', 1);
        filter.addEqual('column2', 'test');
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` = 1 AND `table`.`column2` = 'test')");
            break;
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` = 1 AND `table`.`column2` = 'test')");
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = 1 AND "table"."column2" = \'test\')');
            break;
          case 'mssql':
            expect(sql).to.contain("([table].[column1] = 1 AND [table].[column2] = N'test'");
            break;
        }
      });
    });

    it('Get where using or', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addEqual('column1', 1);
        filter.addEqual('column2', 'test');
        let where = filter.getWhereUsingOr();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(`table`.`column1` = 1 OR `table`.`column2` = 'test')");
            break;
          case 'mysql':
            expect(sql).to.contain("(`table`.`column1` = 1 OR `table`.`column2` = 'test')");
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" = 1 OR "table"."column2" = \'test\')');
            break;
          case 'mssql':
            expect(sql).to.contain("([table].[column1] = 1 OR [table].[column2] = N'test'");
            break;
        }
      });
    });
  });

  describe('Sequelize Condition', () => {
    it('Sequelize.Op.overlap', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addSequelizeCondition({
          column1: { [Sequelize.Op.overlap]: [1, 2] }
        });
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            break;
          case 'mysql':
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" && ARRAY[1,2])');
            break;
          case 'mssql':
            break;
        }
      });
    });
  });

  describe('Annidate Filters', () => {
    it('Annidate or-block of conditions', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addLike(['column1'], '%test%');
        let orBlock = new Filter(support.sequelize);
        orBlock.addEqual('column2', 'abc');
        orBlock.addEqual(`column3`, '2017-11-01', Sequelize.DATEONLY);
        filter.addSequelizeCondition(orBlock.getWhereUsingOr());
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("((`table`.`column1` LIKE '%test%') AND (`table`.`column2` = 'abc' OR CAST(`column3` AS DATE) = '2017-11-01T00:00:00'))");
            break;
          case 'mysql':
            expect(sql).to.contain("((`table`.`column1` LIKE '%test%') AND (`table`.`column2` = 'abc' OR CAST(`column3` AS DATE) = '2017-11-01T00:00:00'))");
            break;
          case 'postgres':
            expect(sql).to.contain('(("table"."column1" ILIKE \'%test%\') AND ("table"."column2" = \'abc\' OR CAST("column3" AS DATE) = \'2017-11-01T00:00:00\'))');
            break;
          case 'mssql':
            expect(sql).to.contain("(([table].[column1] LIKE N'%test%') AND ([table].[column2] = N'abc' OR CAST([column3] AS DATE) = N'2017-11-01T00:00:00'))");
            break;
        }
      });
    });
  });

  describe('In', () => {
    it('Integer', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addIn('column1', [1, 2]);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain('(`table`.`column1` IN (1, 2))');
            break;
          case 'mysql':
            expect(sql).to.contain('(`table`.`column1` IN (1, 2))');
            break;
          case 'postgres':
            expect(sql).to.contain('("table"."column1" IN (1, 2))');
            break;
          case 'mssql':
            expect(sql).to.contain('([table].[column1] IN (1, 2))');
            break;
        }
      });
    });

    it('Datetime', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addIn('column1', ['2017-01-01 18:00', '2017-01-02 18:00'], Sequelize.DATE);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(CAST(`column1` AS DATETIME) IN ('2017-01-01T18:00:00.00000', '2017-01-02T18:00:00.00000'))");
            break;
          case 'mysql':
            expect(sql).to.contain("(CAST(`column1` AS DATETIME) IN ('2017-01-01T18:00:00.00000', '2017-01-02T18:00:00.00000'))");
            break;
          case 'postgres':
            expect(sql).to.contain("(CAST(\"column1\" AS TIMESTAMP(0)) IN ('2017-01-01T18:00:00.00000', '2017-01-02T18:00:00.00000'))");
            break;
          case 'mssql':
            expect(sql).to.contain("(CAST([column1] AS DATETIME) IN (N'2017-01-01T18:00:00.000', N'2017-01-02T18:00:00.000'))");
            break;
        }
      });
    });

    it('Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addIn('column1', ['2017-01-01 18:00', '2017-01-02 18:00'], Sequelize.DATEONLY);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(CAST(`column1` AS DATE) IN ('2017-01-01T00:00:00.00000', '2017-01-02T00:00:00.00000'))");
            break;
          case 'mysql':
            expect(sql).to.contain("(CAST(`column1` AS DATE) IN ('2017-01-01T00:00:00.00000', '2017-01-02T00:00:00.00000'))");
            break;
          case 'postgres':
            expect(sql).to.contain("(CAST(\"column1\" AS DATE) IN ('2017-01-01T00:00:00.00000', '2017-01-02T00:00:00.00000'))");
            break;
          case 'mssql':
            expect(sql).to.contain("(CAST([column1] AS DATE) IN (N'2017-01-01T00:00:00.000', N'2017-01-02T00:00:00.000'))");
            break;
        }
      });
    });

    it('NOT Date', () => {
      supports.forEach((support) => {
        let filter = new Filter(support.sequelize);
        filter.addNotIn('column1', ['2017-01-01 18:00', '2017-01-02 18:00'], Sequelize.DATEONLY);
        let where = filter.getWhere();
        let sql = support.getSql('table', { where: where });
        switch (support.sequelize.getDialect()) {
          case 'sqlite':
            expect(sql).to.contain("(CAST(`column1` AS DATE) NOT IN ('2017-01-01T00:00:00.00000', '2017-01-02T00:00:00.00000'))");
            break;
          case 'mysql':
            expect(sql).to.contain("(CAST(`column1` AS DATE) NOT IN ('2017-01-01T00:00:00.00000', '2017-01-02T00:00:00.00000'))");
            break;
          case 'postgres':
            expect(sql).to.contain("(CAST(\"column1\" AS DATE) NOT IN ('2017-01-01T00:00:00.00000', '2017-01-02T00:00:00.00000'))");
            break;
          case 'mssql':
            expect(sql).to.contain("(CAST([column1] AS DATE) NOT IN (N'2017-01-01T00:00:00.000', N'2017-01-02T00:00:00.000'))");
            break;
        }
      });
    });
  });
});
