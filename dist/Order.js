"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const _ = require("lodash");
class Order {
    static getOrderBy(order, aliasMapping) {
        let _order = [];
        _.forEach(order, (value) => {
            let field = _.findKey(aliasMapping, _.partial(_.isEqual, value[0]));
            if (field) {
                let _item = field.split('.');
                if (value.length > 1)
                    _item.push(value[1]);
                _order.push(_item);
            }
        });
        return _order;
    }
}
exports.Order = Order;
//# sourceMappingURL=Order.js.map