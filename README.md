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

- `value`: value to walk, either object or array
- `handlers`: array of Handler instances
- `options`:
  - `breakWhen`: function, takes Context, returns a boolean, true will stop the walking.

Example:

```javascript
const { walk } = require("saunter");
// See collectValues handler example under the Handler section
const result = walk(value, [collectValues]);
```

## Classes

### `Handler`

The `Handler` class is for building handlers to be used while walking. They will check to see if the context matches a condition. If the `check` returns `true`, the `onTrue` function will be called.

```javascript
const { Handler, WalkResult } = require("saunter");

// Only collect values that aren't objects or arrays
const collectValues = new Handler({
  check: (value, _result, _path) => {
    if (lodash.isPlainObject(value) || lodash.isArray(value)) return false;
    return true;
  },
  onTrue: (value, result, _path) => {
    const newValue = lodash.concat(result.value || [], value);
    return new WalkResult(newValue);
  }
});
```

`Handler` also takes an `onFalse` function that will be called when the check fails.

### `Result`

This is a value class for capturing a result while walking. The `onTrue` functions in handlers should return a `Result`. See example above.

### `Context`

This is passed into functions like `breakWhen` so it can make decisions when to break and stop the walking.

- `checkPassed`: boolean, comes from when running handler `check`
- `trueResult`: Result, comes from handler `onTrue` call
- `falseResult`: Result, comes from handler `onFalse` call
