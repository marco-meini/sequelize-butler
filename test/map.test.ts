import *  as SequelizeButler from '../';
import { expect } from 'chai';

describe('Map', () => {
  let aliases = {
    'user_id': 'id',
    'user_name': 'name',
    'user_email': 'email',
    'roles.role_name': 'role'
  }
  let rows = [
    { 'user_id': 1, 'user_name': 'Marco', 'user_email': 'abc@def.com', 'roles.role_name': 'admin' },
    { 'user_id': 2, 'user_name': 'Mario', 'user_email': 'zxc@vbn.com', 'roles.role_name': 'user' }
  ]
  it('rowsToAliases', () => {
    let _rows = SequelizeButler.Map.rowsToAliases(rows, aliases)
    expect(_rows).to.be.deep.equal([
      { 'id': 1, 'name': 'Marco', 'email': 'abc@def.com', 'role': 'admin' },
      { 'id': 2, 'name': 'Mario', 'email': 'zxc@vbn.com', 'role': 'user' }
    ])
  })

  it('modelToAliases', () => {
    let mapped = SequelizeButler.Map.modelToAliases(rows[0], aliases)
    expect(mapped).to.be.deep.equal({ 'id': 1, 'name': 'Marco', 'email': 'abc@def.com', 'role': 'admin' })
  })

  it('aliasesToModel', () => {
    let model = SequelizeButler.Map.aliasesToModel({ 'id': 1, 'name': 'Marco', 'email': 'abc@def.com', 'role': 'admin' }, aliases)
    expect(model).to.be.deep.equal(rows[0])
  })
})