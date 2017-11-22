"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require("lodash");
class Map {
    static rowsToAliases(rows, aliasesMapping) {
        return rows.map((row) => {
            return _.mapKeys(row, (value, key) => {
                return aliasesMapping[key];
            });
        });
    }
    static modelToAliases(model, aliasesMapping) {
        return _.mapKeys(model, (value, key) => {
            return aliasesMapping[key];
        });
    }
    static aliasesToModel(mapped, aliasesMapping) {
        return _.mapKeys(mapped, (value, key) => {
            let field = _.findKey(aliasesMapping, _.partial(_.isEqual, key));
            if (!field)
                field = key;
            return field;
        });
    }
}
exports.Map = Map;
//# sourceMappingURL=Map.js.map