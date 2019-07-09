"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const _ = __importStar(require("lodash"));
const Sequelize = __importStar(require("sequelize"));
const moment_1 = __importDefault(require("moment"));
class Filter {
    constructor(connection) {
        this.connection = connection;
        this.conditions = [];
        this.milliseconds = this.connection.getDialect() === 'mssql' ? 3 : 5;
    }
    addLike(columns, value) {
        if (columns && columns.length && value && !_.isEmpty(value) && _.isString(value)) {
            let likeConditions = [];
            columns.forEach((column) => {
                let condition = {};
                if (this.connection.getDialect() === 'postgres') {
                    condition[column] = {
                        [Sequelize.Op.iLike]: value
                    };
                }
                else {
                    condition[column] = {
                        [Sequelize.Op.like]: value
                    };
                }
                likeConditions.push(condition);
            });
            this.conditions.push({ [Sequelize.Op.or]: _.assign.apply(this, likeConditions) });
        }
    }
    addNotLike(columns, value) {
        if (columns && columns.length && value && !_.isEmpty(value) && _.isString(value)) {
            let likeConditions = [];
            columns.forEach((column) => {
                let condition = {};
                if (this.connection.getDialect() === 'postgres') {
                    condition[column] = {
                        [Sequelize.Op.notILike]: value
                    };
                }
                else {
                    condition[column] = {
                        [Sequelize.Op.notLike]: value
                    };
                }
                likeConditions.push(condition);
            });
            this.conditions.push({ [Sequelize.Op.and]: _.assign.apply(this, likeConditions) });
        }
    }
    addEqual(column, value, type) {
        if (column) {
            let condition = {};
            if (!_.isNil(value)) {
                switch (type) {
                    case Sequelize.DATE:
                        let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                        condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), cast), moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss'));
                        break;
                    case Sequelize.DATEONLY:
                        condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), 'DATE'), moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss'));
                        break;
                    default:
                        condition[column] = {
                            [Sequelize.Op.eq]: value
                        };
                        break;
                }
            }
            else {
                condition[column] = {
                    [Sequelize.Op.eq]: null
                };
            }
            this.conditions.push(condition);
        }
    }
    addNotEqual(column, value, type) {
        if (column) {
            let condition = {};
            if (!_.isNil(value)) {
                switch (type) {
                    case Sequelize.DATE:
                        let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                        condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), cast), { [Sequelize.Op.ne]: moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss') });
                        break;
                    case Sequelize.DATEONLY:
                        condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), 'DATE'), { [Sequelize.Op.ne]: moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss') });
                        break;
                    case Sequelize.BOOLEAN:
                        condition[column] = {
                            [Sequelize.Op.not]: value
                        };
                        break;
                    default:
                        condition[column] = {
                            [Sequelize.Op.ne]: value
                        };
                        break;
                }
            }
            else {
                condition[column] = {
                    [Sequelize.Op.ne]: null
                };
            }
            this.conditions.push(condition);
        }
    }
    addGreaterTo(column, value, type) {
        if (column && value) {
            let condition = {};
            switch (type) {
                case Sequelize.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), cast), { [Sequelize.Op.gt]: moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
                    break;
                case Sequelize.DATEONLY:
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), 'DATE'), { [Sequelize.Op.gt]: moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
                    break;
                default:
                    condition[column] = {
                        [Sequelize.Op.gt]: value
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
                case Sequelize.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), cast), { [Sequelize.Op.gte]: moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
                    break;
                case Sequelize.DATEONLY:
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), 'DATE'), { [Sequelize.Op.gte]: moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
                    break;
                default:
                    condition[column] = {
                        [Sequelize.Op.gte]: value
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
                case Sequelize.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), cast), { [Sequelize.Op.lt]: moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
                    break;
                case Sequelize.DATEONLY:
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), 'DATE'), { [Sequelize.Op.lt]: moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
                    break;
                default:
                    condition[column] = {
                        [Sequelize.Op.lt]: value
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
                case Sequelize.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), cast), { [Sequelize.Op.lte]: moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
                    break;
                case Sequelize.DATEONLY:
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), 'DATE'), { [Sequelize.Op.lte]: moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
                    break;
                default:
                    condition[column] = {
                        [Sequelize.Op.lte]: value
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
                case Sequelize.DATE:
                    condition[column] = {
                        [Sequelize.Op.between]: [
                            moment_1.default(from).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')),
                            moment_1.default(to).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '9'))
                        ]
                    };
                    break;
                case Sequelize.DATEONLY:
                    from = moment_1.default(from).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
                    to = moment_1.default(to).endOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '9'));
                    condition[column] = {
                        [Sequelize.Op.between]: [from, to]
                    };
                    break;
                default:
                    condition[column] = {
                        [Sequelize.Op.between]: [from, to]
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
                case Sequelize.DATE:
                    condition[column] = {
                        [Sequelize.Op.notBetween]: [
                            moment_1.default(from).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')),
                            moment_1.default(to).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '9'))
                        ]
                    };
                    break;
                case Sequelize.DATEONLY:
                    from = moment_1.default(from).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
                    to = moment_1.default(to).endOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '9'));
                    condition[column] = {
                        [Sequelize.Op.notBetween]: [from, to]
                    };
                    break;
                default:
                    condition[column] = {
                        [Sequelize.Op.notBetween]: [from, to]
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
                case Sequelize.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), cast), {
                        [Sequelize.Op.in]: values.map((value) => {
                            return moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
                        })
                    });
                    break;
                case Sequelize.DATEONLY:
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), 'DATE'), {
                        [Sequelize.Op.in]: values.map((value) => {
                            return moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
                        })
                    });
                    break;
                default:
                    condition[column] = {
                        [Sequelize.Op.in]: values
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
                case Sequelize.DATE:
                    let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), cast), {
                        [Sequelize.Op.notIn]: values.map((value) => {
                            return moment_1.default(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
                        })
                    });
                    break;
                case Sequelize.DATEONLY:
                    condition = Sequelize.where(Sequelize.cast(Sequelize.col(column), 'DATE'), {
                        [Sequelize.Op.notIn]: values.map((value) => {
                            return moment_1.default(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
                        })
                    });
                    break;
                default:
                    condition[column] = {
                        [Sequelize.Op.notIn]: values
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
                [Sequelize.Op.and]: this.conditions
            };
        }
        return {};
    }
    getWhereUsingOr() {
        if (this.conditions.length) {
            return {
                [Sequelize.Op.or]: this.conditions
            };
        }
        return {};
    }
}
exports.Filter = Filter;
//# sourceMappingURL=Filter.js.map