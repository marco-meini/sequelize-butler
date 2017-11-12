'use strict'
/* global describe, it */

const Order = require('../src/Order')
const chai = require('chai')
const expect = chai.expect

describe('Order', () => {
  let aliases = {
    'user_id': 'id',
    'user_name': 'name',
    'user_email': 'email',
    'roles.role_name': 'role'
  }
  it('getOrderBy', () => {
    let order = [['name', 'ASC'], ['role', 'DESC']]
    let orderBy = Order.getOrderBy(order, aliases)
    expect(orderBy).to.be.deep.equal([ [ 'user_name', 'ASC' ], [ 'roles', 'role_name', 'DESC' ] ])
  })
})
