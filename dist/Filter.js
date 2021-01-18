"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Filter = void 0;
const lodash_1 = __importDefault(require("lodash"));
const sequelize_1 = require("sequelize");
const moment_1 = __importDefault(require("moment"));
class Filter {
    constructor(connection) {
        this.connection = connection;
        this.conditions = [];
        this.milliseconds = this.connection.getDialect() === 'mssql' ? 3 : 5;
    }
    addLike(columns, value) {
        if (columns && columns.length && value && !lodash_1.default.isEmpty(value) && lodash_1.default.isString(value)) {
            let likeConditions = [];
            columns.forEach((column) => {
                let condition = {};
                if (this.connection.getDialect() === 'postgres') {
                    condition[column] = {
                        [sequelize_1.Op.iLike]: value
                    };
                }
                else {
                    condition[column] = {
                        [sequelize_1.Op.like]: value
                    };
                }
                likeConditions.push(condition);
            });
            this.conditions.push({ [sequelize_1.Op.or]: lodash_1.default.assign.apply(this, likeConditions) });
        }
    }
    addNotLike(columns, value) {
        if (columns && columns.length && value && !lodash_1.default.isEmpty(value) && lodash_1.default.isString(value)) {
            let likeConditions = [];
            columns.forEach((column) => {
                let condition = {};
                if (this.connection.getDialect() === 'postgres') {
                    condition[column] = {
                        [sequelize_1.Op.notILike]: value
                    };
                }
                else {
                    condition[column] = {
                        [sequelize_1.Op.notLike]: value
                    };
                }
                likeConditions.push(condition);
            });
            this.conditions.push({ [sequelize_1.Op.and]: lodash_1.default.assign.apply(this, likeConditions) });
        }
    }
    addEqual(column, value, type) {
        if (column) {
            let condition = {};
            if (!lodash_1.default.isNil(value)) {
                switch (type) {
                    case sequelize_1.DATE:
                        let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                        condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), cast), moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss'));
                        break;
                    case sequelize_1.DATEONLY:
                        condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), 'DATE'), moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss'));
                        break;
                    default:
                        condition[column] = {
                            [sequelize_1.Op.eq]: value
                        };
                        break;
                }
            }
            else {
                condition[column] = {
                    [sequelize_1.Op.eq]: null
                };
            }
            this.conditions.push(condition);
        }
    }
    addNotEqual(column, value, type) {
        if (column) {
            let condition = {};
            if (!lodash_1.default.isNil(value)) {
                switch (type) {
                    case sequelize_1.DATE:
                        let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                        condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), cast), { [sequelize_1.Op.ne]: moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss') });
                        break;
                    case sequelize_1.DATEONLY:
                        condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), 'DATE'), { [sequelize_1.Op.ne]: moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss') });
                        break;
                    case sequelize_1.BOOLEAN:
                        condition[column] = {
                            [sequelize_1.Op.not]: value
                        };
                        break;
                    default:
                        condition[column] = {
                            [sequelize_1.Op.ne]: value
                        };
                        break;
                }
            }
            else {
                condition[column] = {
                    [sequelize_1.Op.ne]: null
                };
            }
            this.conditions.push(condition);
        }
    }
    addGreaterTo(column, value, type) {
        if (column && value) {
            let condition = {};
            switch (type) {
                case sequelize_1.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), cast), { [sequelize_1.Op.gt]: moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0')) });
                    break;
                case sequelize_1.DATEONLY:
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), 'DATE'), { [sequelize_1.Op.gt]: moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0')) });
                    break;
                default:
                    condition[column] = {
                        [sequelize_1.Op.gt]: value
                    };
                    break;
            }
            this.conditions.push(condition);
        }
    }
    addGreaterEqualTo(column, value, type) {
        if (column && value) {
            let condition = {};
            switch (type) {
                case sequelize_1.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), cast), { [sequelize_1.Op.gte]: moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0')) });
                    break;
                case sequelize_1.DATEONLY:
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), 'DATE'), { [sequelize_1.Op.gte]: moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0')) });
                    break;
                default:
                    condition[column] = {
                        [sequelize_1.Op.gte]: value
                    };
                    break;
            }
            this.conditions.push(condition);
        }
    }
    addLessTo(column, value, type) {
        if (column && value) {
            let condition = {};
            switch (type) {
                case sequelize_1.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), cast), { [sequelize_1.Op.lt]: moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0')) });
                    break;
                case sequelize_1.DATEONLY:
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), 'DATE'), { [sequelize_1.Op.lt]: moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0')) });
                    break;
                default:
                    condition[column] = {
                        [sequelize_1.Op.lt]: value
                    };
                    break;
            }
            this.conditions.push(condition);
        }
    }
    addLessEqualTo(column, value, type) {
        if (column && value) {
            let condition = {};
            switch (type) {
                case sequelize_1.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), cast), { [sequelize_1.Op.lte]: moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0')) });
                    break;
                case sequelize_1.DATEONLY:
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), 'DATE'), { [sequelize_1.Op.lte]: moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0')) });
                    break;
                default:
                    condition[column] = {
                        [sequelize_1.Op.lte]: value
                    };
                    break;
            }
            this.conditions.push(condition);
        }
    }
    addBetween(column, from, to, type) {
        if (column && from && to && typeof (from) === typeof (to)) {
            let condition = {};
            switch (type) {
                case sequelize_1.DATE:
                    condition[column] = {
                        [sequelize_1.Op.between]: [
                            moment_1.default(from).format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0')),
                            moment_1.default(to).format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '9'))
                        ]
                    };
                    break;
                case sequelize_1.DATEONLY:
                    from = moment_1.default(from).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0'));
                    to = moment_1.default(to).endOf('day').format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '9'));
                    condition[column] = {
                        [sequelize_1.Op.between]: [from, to]
                    };
                    break;
                default:
                    condition[column] = {
                        [sequelize_1.Op.between]: [from, to]
                    };
                    break;
            }
            this.conditions.push(condition);
        }
    }
    addNotBetween(column, from, to, type) {
        if (column && from && to && typeof (from) === typeof (to)) {
            let condition = {};
            switch (type) {
                case sequelize_1.DATE:
                    condition[column] = {
                        [sequelize_1.Op.notBetween]: [
                            moment_1.default(from).format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0')),
                            moment_1.default(to).format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '9'))
                        ]
                    };
                    break;
                case sequelize_1.DATEONLY:
                    from = moment_1.default(from).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0'));
                    to = moment_1.default(to).endOf('day').format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '9'));
                    condition[column] = {
                        [sequelize_1.Op.notBetween]: [from, to]
                    };
                    break;
                default:
                    condition[column] = {
                        [sequelize_1.Op.notBetween]: [from, to]
                    };
                    break;
            }
            this.conditions.push(condition);
        }
    }
    addIn(column, values, type) {
        if (column) {
            let condition = {};
            switch (type) {
                case sequelize_1.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), cast), {
                        [sequelize_1.Op.in]: values.map((value) => {
                            return moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0'));
                        })
                    });
                    break;
                case sequelize_1.DATEONLY:
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), 'DATE'), {
                        [sequelize_1.Op.in]: values.map((value) => {
                            return moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0'));
                        })
                    });
                    break;
                default:
                    condition[column] = {
                        [sequelize_1.Op.in]: values
                    };
                    break;
            }
            this.conditions.push(condition);
        }
    }
    addNotIn(column, values, type) {
        if (column) {
            let condition = {};
            switch (type) {
                case sequelize_1.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), cast), {
                        [sequelize_1.Op.notIn]: values.map((value) => {
                            return moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0'));
                        })
                    });
                    break;
                case sequelize_1.DATEONLY:
                    condition = sequelize_1.where(new sequelize_1.Utils.Cast(new sequelize_1.Utils.Col(column), 'DATE'), {
                        [sequelize_1.Op.notIn]: values.map((value) => {
                            return moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + lodash_1.default.padEnd('', this.milliseconds, '0'));
                        })
                    });
                    break;
                default:
                    condition[column] = {
                        [sequelize_1.Op.notIn]: values
                    };
                    break;
            }
            this.conditions.push(condition);
        }
    }
    addSequelizeCondition(condition) {
        this.conditions.push(condition);
    }
    getWhere() {
        if (this.conditions.length) {
            return {
                [sequelize_1.Op.and]: this.conditions
            };
        }
        return {};
    }
    getWhereUsingOr() {
        if (this.conditions.length) {
            return {
                [sequelize_1.Op.or]: this.conditions
            };
        }
        return {};
    }
}
exports.Filter = Filter;
//# sourceMappingURL=Filter.js.map