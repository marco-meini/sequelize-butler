import * as _ from 'lodash';

export class Order {
  public static getOrderBy(order: Array<Array<string>>, aliasMapping: any): Array<any> {
    let _order: Array<any> = [];
    _.forEach(order, (value: Array<string>) => {
      let field: string = _.findKey(aliasMapping, _.partial(_.isEqual, value[0]))
      if (field) {
        let _item: Array<string> = field.split('.')
        if (value.length > 1) _item.push(value[1])
        _order.push(_item)
      }
    })
    return _order
  }
}