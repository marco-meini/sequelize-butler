# sequelize-butler
[![npm](https://img.shields.io/npm/v/sequelize-butler.svg)](https://www.npmjs.com/package/sequelize-butler)

Useful features to facilitate the use of Sequelize

## Install

```
npm i sequelize-butler
```

## Filter
Tool to write where conditions for sequelize more easily

### Instance

```
const SequelizeButler = require('sequelize-butler')
const Sequelize = require('sequelize')

let sequelize = new Sequelize({ [...] })
let filter = new SequelizeButler.Filter(sequelize)
```

### Methods
The following methods with the "add" prefix allow to add where-conditions to Filter instance, while methods with the "get" prefix transform the added where-conditions into a "where" object that can be used by sequelize

#### addLike
Adds a like condition to one or more columns

##### Arguments
- columns: array of columns to wich run the condition
- value: test to search

##### Example
Code:
```
filter.addLike(['column1', 'column2'], 'abc')
```

SQL output (PG in this example):
```
("table"."column1" ILIKE '%abc%' OR "table"."column2" ILIKE '%abc%')
```

#### addNotLike
Adds a not-like condition to one or more columns

##### Arguments
- columns: array of columns to wich run the condition
- value: test to search

##### Example
Code:
```
filter.addNotLike(['column1', 'column2'], 'abc')
```

SQL output (PG in this example):
```
("table"."column1" NOT ILIKE '%abc%' AND "table"."column2" NOT ILIKE '%abc%')
```

#### addEqual
Adds an equal condition to one column, for dates you must specify the type

##### Arguments
- column: column to compare 
- value: value to compare to column
- type (optional): Sequelize data type


##### Example
Code:
```
filter.addEqual('column1', '2017-01-01 18:00', Sequelize.DATE)
```

SQL output (PG in this example):
```
(CAST('column1' AS TIMESTAMP(0)) = '2017-01-01T18:00:00')
```

#### addNotEqual
Add a not-equal condition to one column, for dates you must specify the type

##### Arguments
- column: column to compare 
- value: value to compare to column
- type (optional): Sequelize data type

##### Example
Code:
```
filter.addNotEqual('column1', '2017-01-01 18:00', Sequelize.DATEONLY)
```

SQL output (PG in this example):
```
(CAST('column1' AS DATE) != '2017-01-01T00:00:00')
```

#### addGreaterTo
Adds a greater-to condition to one column, for dates you must specify the type

##### Arguments
- column: column to compare 
- value: value to compare to column
- type (optional): Sequelize data type

##### Example
Code:
```
filter.addGreaterTo('column1', 2)
```

SQL output (PG in this example):
```
("table"."column1" > 2)
```

#### addGreaterEqualTo
Adds a greater-equal-to condition to one column, for dates you must specify the type

##### Arguments
- column: column to compare 
- value: value to compare to column
- type (optional): Sequelize data type

##### Example
Code:
```
filter.addGreaterEqualTo('column1', 2)
```

SQL output (PG in this example):
```
("table"."column1" >= 2)
```

#### addLessTo
Adds a less-to condition to one column, for dates you must specify the type

##### Arguments
- column: column to compare 
- value: value to compare to column
- type (optional): Sequelize data type

##### Example
Code:
```
filter.addLessTo('column1', 2)
```

SQL output (PG in this example):
```
("table"."column1" < 2)
```

#### addLessEqualTo
Adds a less-equal-to condition to one column, for dates you must specify the type

##### Arguments
- column: column to compare 
- value: value to compare to column
- type (optional): Sequelize data type

##### Example
Code:
```
filter.addLessEqualTo('column1', 2)
```

SQL output (PG in this example):
```
("table"."column1" <= 2)
```

#### addBetween
Adds a between condition to one column, for dates you must specify the type

##### Arguments
- column: column to compare 
- from: left extremity of the range 
- to: right extremity of the range
- type (optional): Sequelize data type

##### Example
Code:
```
filter.addBetween('column1', '2017-01-01 18:00', '2017-01-01 19:00', Sequelize.DATE)
```

SQL output (PG in this example):
```
("table"."column1" BETWEEN '2017-01-01T18:00:00.00000' AND '2017-01-01T19:00:00.99999')
```

#### addNotBetween
Adds a not-between condition to one column, for dates you must specify the type

##### Arguments
- column: column to compare 
- from: left extremity of the range 
- to: right extremity of the range
- type (optional): Sequelize data type

##### Example
Code:
```
filter.addNotBetween('column1', '2017-01-01 18:00', '2017-01-02 19:00', Sequelize.DATEONLY)
```

SQL output (PG in this example):
```
("table"."column1" NOT BETWEEN '2017-01-01T00:00:00.00000' AND '2017-01-02T23:59:59.99999')
```

#### addIn
Adds a in condition to one column, for dates you must specify the type

##### Arguments
- column: column to compare 
- values: array of values to compare to column
- type (optional): Sequelize data type

##### Example
Code:
```
filter.addIn('column1', [1, 2])
```

SQL output (PG in this example):
```
("table"."column1" IN (1, 2))
```

#### addNotIn
Adds a not-in condition to one column, for dates you must specify the type

##### Arguments
- column: column to compare 
- values: array of values to compare to column
- type (optional): Sequelize data type

##### Example
Code:
```
filter.addNotIn('column1', [1, 2])
```

SQL output (PG in this example):
```
("table"."column1" NOT IN (1, 2))
```

#### addSequelizeCondition
Adds a custom condition not included in the previous ones

##### Arguments
- condition: Sequelize condition

##### Example
Code:
```
filter.addSequelizeCondition({
  column1: { [Sequelize.Op.overlap]: [1, 2] }
})
```

SQL output (PG in this example):
```
("table"."column1" && ARRAY[1,2])
```

#### getWhere
Gets a where object to use in a sequelize query, with all added condition in AND

##### Example
Code:
```
filter.addEqual('column1', 1)
filter.addEqual('column2', 'test')

model.findaAll({
  ...
  where: filter.getWhere()
  ...
})

```

SQL output (PG in this example):
```
("table"."column1" = 1 AND "table"."column2" = 'test')
```

#### getWhereUsingOr
Gets a where object to use in a sequelize query, with all added condition in OR

##### Example
Code:
```
filter.addEqual('column1', 1)
filter.addEqual('column2', 'test')

model.findaAll({
  ...
  where: filter.getWhereUsingOr()
  ...
})

```

SQL output (PG in this example):
```
WHERE ("table"."column1" = 1 OR "table"."column2" = 'test')
```

#### Annidate Conditions
This example shows how to implement nested filters

Code:
```
let filter = new Filter(sequelize)
filter.addLike(['column1'], 'test')
let orBlock = new Filter(sequelize)
orBlock.addEqual('column2', 'abc')
orBlock.addEqual('column3', 5)
filter.addSequelizeCondition(orBlock.getWhereUsingOr())
let where = filter.getWhere()
```

SQL output (PG in this example):
```
WHERE (("table"."column1" ILIKE '%test%') 
AND ("table"."column2" = 'abc' OR "table"."column3" = 5))
```

## Order
Tool to write order-by conditions for sequelize more easily

### Static methods

#### getOrderBy
Gets an order object to use in a sequelize query when aliases are used

Code:
```
const SequelizeButler = require('sequelize-butler')

let aliases = {
  'user_id': 'id',
  'user_name': 'name',
  'user_email': 'email',
  'roles.role_name': 'role'
}

let order = [['name', 'ASC'], ['role', 'DESC']]

model.findaAll({
  ...
  order: SequelizeButler.Order.getOrderBy(order, aliases)
  ...
})
```

### Map
Tool for transforming query outputs with aliases and vice versa

### Static methods

#### rowsToAliases
Transforms an array, returned for example by a findaAll function, into an array of objects that using aliases

Code:
```
let aliases = {
  'user_id': 'id',
  'user_name': 'name',
  'user_email': 'email',
  'roles.role_name': 'role'
}

model.findAll({
  ...
}).then((rows) => {
  rows = SequelizeHelper.Map.rowsToAliases(rows, aliases)
})
```

Original rows example:
```
[
    { 'user_id': 1, 'user_name': 'Marco', 'user_email': 'abc@def.com', 'roles.role_name': 'admin' },
    { 'user_id': 2, 'user_name': 'Mario', 'user_email': 'zxc@vbn.com', 'roles.role_name': 'user' }
]
```

Transformed rows example:
```
[
  { 'id': 1, 'name': 'Marco', 'email': 'abc@def.com', 'role': 'admin' },
  { 'id': 2, 'name': 'Mario', 'email': 'zxc@vbn.com', 'role': 'user' }
]
```

#### modelToAliases
Transforms an object, returned for example by a findById function, into an object that using aliases

Code:
```
let aliases = {
  'user_id': 'id',
  'user_name': 'name',
  'user_email': 'email',
  'roles.role_name': 'role'
}

model.findById(1, {
  ...
}).then((user) => {
  user = SequelizeHelper.Map.modelToAliases(user, aliases)
})
```

Original object example:
```
{ 
  'user_id': 1, 
  'user_name': 'Marco', 
  'user_email': 'abc@def.com', 
  'roles.role_name': 'admin' 
}
```

Transformed object example:
```
{ 
  'id': 1,
  'name': 'Marco', 
  'email': 'abc@def.com', 
  'role': 'admin' 
}
```

#### aliasesToModel
Transforms an object, mapped with aliases, into a raw model object

Code:
```
let aliases = {
  'user_id': 'id',
  'user_name': 'name',
  'user_email': 'email',
  'roles.role_name': 'role'
}

let model = Map.aliasesToModel({ 'id': 1, 'name': 'Marco', 'email': 'abc@def.com', 'role': 'admin' }, aliases)
```

Original object example:
```
{ 
  'id': 1,
  'name': 'Marco', 
  'email': 'abc@def.com', 
  'role': 'admin' 
}
```

Transformed object example:
```
{ 
  'user_id': 1, 
  'user_name': 'Marco', 
  'user_email': 'abc@def.com', 
  'roles.role_name': 'admin' 
}
```

## Error
Tool for parsing sequelize validation errors into a more usable object

### Instance

```
const SequelizeButler = require('sequelize-butler')
const Sequelize = require('sequelize')

let sequelize = new Sequelize({ [...] })
model = sequelize.define('table', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true
  },
  name: {
    type: Sequelize.TEXT,
    allowNull: false
  },
  email: {
    type: Sequelize.TEXT,
    validate: {
      isEmail: {
        msg: 'Email is not valid'
      }
    }
  }
})

model.create({
      email: 'abcd'
}).then(() => {
    ...
}).catch((error) => {
  let errorParser = new SequelizeButler.Error(error)
  ....
})
```

### Methods

#### isValidationError
Returns true if the error is generated by a validation, false otherwise.

Code:
```
errorParser.isValidationError()
```

#### getResults
Returns a json object with the validation errors

Code:
```
errorParser.getResults('There are some errors')
```

Otput example:
```
{
  success: false,
  message: 'There are some errors',
  subresults: [
    { success: false, message: 'table.name cannot be null' },
    { success: false, message: 'Email is not valid' }
  ]
}
```