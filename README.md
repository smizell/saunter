# Saunter

Walk through data. Do things as you go. Collect the things you need.

## Install

```sh
npm install saunter
```

## Usage

### `walk`

Walks through objects and arrays.

```javascript
walk(value, handlers, options);
```

Arguments:

- `value`: object | array, value to walk
- `handlers`: array[Handler] instances
- `options`:
  - `breakWhen`: (Context) -> boolean, true stops the walking

Example:

```javascript
const { walk } = require("saunter");
// See collectValues handler example under the Handler section
const result = walk({ foo: 1, bar: 2 }, [collectValues]);
// result = [1, 2]
```

## Classes

### `Handler`

The `Handler` class is for building handlers to be used while walking. They will check to see if the context matches a condition. If the `check` returns `true`, the `onTrue` function will be called. Otherwise, the `onFalse` function will be called.

Example:

```javascript
const lodash = require("lodash");
const { walk, Handler, Result } = require("saunter");

// Only collect values that aren't objects or arrays
const collectValues = new Handler({
  check: (value, _result, _path) => {
    if (lodash.isPlainObject(value) || lodash.isArray(value)) return false;
    return true;
  },
  onTrue: (value, result, _path) => {
    const newValue = lodash.concat(result.value || [], value);
    return new Result(newValue);
  }
});

const result = walk({ foo: 1, bar: 2 }, [collectValues]);
// result = [1, 2]
```

#### Constructor

Arguments:

- `check`: (value, Result, path, initial) -> boolean
- `onTrue`: (value, Result, path, initial) -> Result
- `onFalse`: (value, Result, path, initial) -> Result

### `Result`

This is a value class for capturing a result while walking. The `onTrue` functions in handlers should return a `Result`. See example above.

Example:

```javascript
const result = new Result("foo");
console.log(result.value);
```

#### Constructor

Arguments:

- `value`: string, value of result

### `Context`

This is passed into functions like `breakWhen` so it can make decisions when to break and stop the walking.

Attributes:

- `#checkPassed`: boolean, return value of Handler#check
- `#trueResult`: Result, return value of Handler#onTrue
- `#falseResult`: Result, return value of Handler#onFalse
