"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
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