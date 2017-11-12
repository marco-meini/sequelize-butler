'use strict'

const _ = require('lodash')

const Order = {
  getOrderBy: (order, aliasMapping) => {
    let _order = []
    if (_.isArray(order)) {
      _.forEach(order, (value) => {
        let field = _.findKey(aliasMapping, _.partial(_.isEqual, value[0]))
        if (field) {
          let _item = field.split('.')
          if (value.length > 1) _item.push(value[1])
          _order.push(_item)
        }
      })
    }
    return _order
  }
}

module.exports = Order
