'use strict';

const Sequelize = require('sequelize')

class Support {
  constructor(dialect) {
    this.sequelize = new Sequelize({
      dialect: dialect
    });

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
    });
  }

  getSql(table, options) {
    let sql = this.sequelize.dialect.queryGenerator;
    return sql.selectQuery(table, options);
  }
}

module.exports = Support
