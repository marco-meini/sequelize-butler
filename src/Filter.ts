import _ from 'lodash';
import { Sequelize, Op, DATE, DATEONLY, Utils, where, DataTypeAbstract, BOOLEAN } from 'sequelize';
import moment from 'moment';

export class Filter {
  private conditions: Array<any> = [];
  private milliseconds: number;

  constructor(private connection: Sequelize) {
    this.milliseconds = this.connection.getDialect() === 'mssql' ? 3 : 5;
  }

  addLike(columns: Array<string>, value: string) {
    if (columns && columns.length && value && !_.isEmpty(value) && _.isString(value)) {
      let likeConditions: Array<any> = [];
      columns.forEach((column) => {
        let condition: any = {};
        if (this.connection.getDialect() === 'postgres') {
          condition[column] = {
            [Op.iLike]: value
          };
        } else {
          condition[column] = {
            [Op.like]: value
          };
        }
        likeConditions.push(condition);
      });
      this.conditions.push({ [Op.or]: _.assign.apply(this, likeConditions) });
    }
  }

  addNotLike(columns: Array<string>, value: string) {
    if (columns && columns.length && value && !_.isEmpty(value) && _.isString(value)) {
      let likeConditions: Array<any> = [];
      columns.forEach((column) => {
        let condition: any = {};
        if (this.connection.getDialect() === 'postgres') {
          condition[column] = {
            [Op.notILike]: value
          };
        } else {
          condition[column] = {
            [Op.notLike]: value
          };
        }
        likeConditions.push(condition);
      });
      this.conditions.push({ [Op.and]: _.assign.apply(this, likeConditions) });
    }
  }

  addEqual(column: string, value: any, type?: DataTypeAbstract) {
    if (column) {
      let condition: any = {};
      if (!_.isNil(value)) {
        switch (type) {
          case DATE:
            let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
            condition = where(new Utils.Cast(new Utils.Col(column), cast), moment(value).format('YYYY-MM-DDTHH:mm:ss'));
            break;
          case DATEONLY:
            condition = where(new Utils.Cast(new Utils.Col(column), 'DATE'), moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss'));
            break;
          default:
            condition[column] = {
              [Op.eq]: value
            };
            break;
        }
      } else {
        condition[column] = {
          [Op.eq]: null
        };
      }
      this.conditions.push(condition);
    }
  }

  addNotEqual(column: string, value: any, type?: DataTypeAbstract) {
    if (column) {
      let condition: any = {};
      if (!_.isNil(value)) {
        switch (type) {
          case DATE:
            let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
            condition = where(new Utils.Cast(new Utils.Col(column), cast), { [Op.ne]: moment(value).format('YYYY-MM-DDTHH:mm:ss') });
            break;
          case DATEONLY:
            condition = where(new Utils.Cast(new Utils.Col(column), 'DATE'), { [Op.ne]: moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss') });
            break;
          case BOOLEAN:
            condition[column] = {
              [Op.not]: value
            };
            break;
          default:
            condition[column] = {
              [Op.ne]: value
            };
            break;
        }
      } else {
        condition[column] = {
          [Op.ne]: null
        };
      }
      this.conditions.push(condition);
    }
  }

  addGreaterTo(column: string, value: any, type?: DataTypeAbstract) {
    if (column && value) {
      let condition: any = {};
      switch (type) {
        case DATE:
          let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
          condition = where(new Utils.Cast(new Utils.Col(column), cast), { [Op.gt]: moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
          break;
        case DATEONLY:
          condition = where(new Utils.Cast(new Utils.Col(column), 'DATE'), { [Op.gt]: moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
          break;
        default:
          condition[column] = {
            [Op.gt]: value
          };
          break;
      }
      this.conditions.push(condition);
    }
  }

  addGreaterEqualTo(column: string, value: any, type?: DataTypeAbstract) {
    if (column && value) {
      let condition: any = {};
      switch (type) {
        case DATE:
          let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
          condition = where(new Utils.Cast(new Utils.Col(column), cast), { [Op.gte]: moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
          break;
        case DATEONLY:
          condition = where(new Utils.Cast(new Utils.Col(column), 'DATE'), { [Op.gte]: moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
          break;
        default:
          condition[column] = {
            [Op.gte]: value
          };
          break;
      }
      this.conditions.push(condition);
    }
  }

  addLessTo(column: string, value: any, type?: DataTypeAbstract) {
    if (column && value) {
      let condition: any = {};
      switch (type) {
        case DATE:
          let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
           condition = where(new Utils.Cast(new Utils.Col(column), cast), { [Op.lt]: moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
          break;
        case DATEONLY:
           condition = where(new Utils.Cast(new Utils.Col(column), 'DATE'), { [Op.lt]: moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
          break;
        default:
          condition[column] = {
            [Op.lt]: value
          };
          break;
      }
      this.conditions.push(condition);
    }
  }

  addLessEqualTo(column: string, value: any, type?: DataTypeAbstract) {
    if (column && value) {
      let condition: any = {};
      switch (type) {
        case DATE:
          let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
          condition = where(new Utils.Cast(new Utils.Col(column), cast), { [Op.lte]: moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
          break;
        case DATEONLY:
          condition = where(new Utils.Cast(new Utils.Col(column), 'DATE'), { [Op.lte]: moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')) });
          break;
        default:
          condition[column] = {
            [Op.lte]: value
          };
          break;
      }
      this.conditions.push(condition);
    }
  }

  addBetween(column: string, from: any, to: any, type?: DataTypeAbstract) {
    if (column && from && to && typeof (from) === typeof (to)) {
      let condition: any = {};
      switch (type) {
        case DATE:
          condition[column] = {
            [Op.between]: [
              moment(from).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')),
              moment(to).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '9'))
            ]
          };
          break;
        case DATEONLY:
          from = moment(from).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
          to = moment(to).endOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '9'));
          condition[column] = {
            [Op.between]: [from, to]
          };
          break;
        default:
          condition[column] = {
            [Op.between]: [from, to]
          };
          break;
      }
      this.conditions.push(condition);
    }
  }

  addNotBetween(column: string, from: any, to: any, type?: DataTypeAbstract) {
    if (column && from && to && typeof (from) === typeof (to)) {
      let condition: any = {};
      switch (type) {
        case DATE:
          condition[column] = {
            [Op.notBetween]: [
              moment(from).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0')),
              moment(to).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '9'))
            ]
          };
          break;
        case DATEONLY:
          from = moment(from).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
          to = moment(to).endOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '9'));
          condition[column] = {
            [Op.notBetween]: [from, to]
          };
          break;
        default:
          condition[column] = {
            [Op.notBetween]: [from, to]
          };
          break;
      }
      this.conditions.push(condition);
    }
  }

  addIn(column: string, values: Array<any>, type?: DataTypeAbstract) {
    if (column) {
      let condition: any = {};
      switch (type) {
        case DATE:
          let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
          condition = where(new Utils.Cast(new Utils.Col(column), cast), {
            [Op.in]: values.map((value) => {
              return moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
            })
          });
          break;
        case DATEONLY:
          condition = where(new Utils.Cast(new Utils.Col(column), 'DATE'), {
            [Op.in]: values.map((value) => {
              return moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
            })
          });
          break;
        default:
          condition[column] = {
            [Op.in]: values
          };
          break;
      }
      this.conditions.push(condition);
    }
  }

  addNotIn(column: string, values: Array<any>, type?: DataTypeAbstract) {
    if (column) {
      let condition: any = {};
      switch (type) {
        case DATE:
          let cast = this.connection.getDialect() === 'postgres' ? 'timestamp(0)' : 'DATETIME';
          condition = where(new Utils.Cast(new Utils.Col(column), cast), {
            [Op.notIn]: values.map((value) => {
              return moment(value).format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
            })
          });
          break;
        case DATEONLY:
          condition = where(new Utils.Cast(new Utils.Col(column), 'DATE'), {
            [Op.notIn]: values.map((value) => {
              return moment(value).startOf('day').format('YYYY-MM-DDTHH:mm:ss.' + _.padEnd('', this.milliseconds, '0'));
            })
          });
          break;
        default:
          condition[column] = {
            [Op.notIn]: values
          };
          break;
      }
      this.conditions.push(condition);
    }
  }

  addSequelizeCondition(condition: any) {
    this.conditions.push(condition);
  }

  getWhere(): any {
    if (this.conditions.length) {
      return {
        [Op.and]: this.conditions
      };
    }
    return {};
  }

  getWhereUsingOr(): any {
    if (this.conditions.length) {
      return {
        [Op.or]: this.conditions
      };
    }
    return {};
  }
}