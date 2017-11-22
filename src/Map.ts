import * as _ from 'lodash';

export class Map {
  public static rowsToAliases(rows: Array<any>, aliasesMapping: any) {
    return rows.map((row) => {
      return _.mapKeys(row, (value, key) => {
        return aliasesMapping[key];
      });
    });
  }

  public static modelToAliases(model: any, aliasesMapping: any) {
    return _.mapKeys(model, (value, key) => {
      return aliasesMapping[key];
    });
  }

  public static aliasesToModel(mapped: any, aliasesMapping: any) {
    return _.mapKeys(mapped, (value: any, key: string) => {
      let field = _.findKey(aliasesMapping, _.partial(_.isEqual, key));
      if (!field) field = key;
      return field;
    });
  }
}
