'use strict'

const _ = require('lodash')

const Map = {
  rowsToAliases: (rows, aliasesMapping) => {
    return rows.map((row) => {
      return _.mapKeys(row, (value, key) => {
        return aliasesMapping[key]
      })
    })
  },
  modelToAliases: (model, aliasesMapping) => {
    return _.mapKeys(model, (value, key) => {
      return aliasesMapping[key]
    })
  },
  aliasesToModel: (mapped, aliasesMapping) => {
    return _.mapKeys(mapped, (value, key) => {
      let field = _.findKey(aliasesMapping, _.partial(_.isEqual, key))
      if (!field) field = key
      return field
    })
  }
}

module.exports = Map
