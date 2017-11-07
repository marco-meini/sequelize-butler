'use strict'
/* global describe, it */

const Filter = require('../src/Filter')
const TestModel = require('./model/TestModel')
const chai = require('chai')
const expect = chai.expect
const Sequelize = require('sequelize')

describe('Filter', () => {
  it('Add like', () => {
    let filter = new Filter(TestModel.sequelize.getDialect())
    filter.addLike(['column1', 'column2'], 'abc')
    let where = filter.getWhere()
    expect(TestModel.getSql({where: where})).to.contain("`tests`.`column1` LIKE '%abc%' OR `tests`.`column2` LIKE '%abc%'")
  })
})
