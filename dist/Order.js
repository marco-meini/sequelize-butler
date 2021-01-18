"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = void 0;
const lodash_1 = __importDefault(require("lodash"));
class Order {
    static getOrderBy(order, aliasMapping) {
        let _order = [];
        lodash_1.default.forEach(order, (value) => {
            let field = lodash_1.default.findKey(aliasMapping, lodash_1.default.partial(lodash_1.default.isEqual, value[0]));
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