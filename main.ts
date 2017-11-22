import { SqError, Result as SqbResult, SubResult as SqbSubResult } from './src/Error';
import { Filter as SqbFilter } from './src/Filter';
import { Order as SqbOrder } from './src/Order';
import { Map as SqbMap } from './src/Map';

export namespace SequelizeButler {
  export const Map = SqbMap;
  export const Order = SqbOrder;
  export const Error = SqError;
  export const Result = SqbResult;
  export const SubResult = SqbSubResult;
  export const Filter = SqbFilter;
}