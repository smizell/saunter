# Saunter

Walk through data. Do things as you go.

## Install

```sh
npm install saunter
```

## Usage

Saunter is meant to be used with libraries like [Ramda](https://ramdajs.com/), [Transducers.js](https://github.com/cognitect-labs/transducers-js), or [Lodash](https://lodash.com/).

### `walk`

The `walk` function takes an object or array and walks through it. Calling `walk` will return a generator. The generator yields a `walkObject` for every value it finds with the following properties.

The `walkObject` signature:

- `path` (array) - The path to the value. It will be an array of object properties and array indexes.
- `value` (any) - The value for the given path.

Note: this will find every value, even objects, and then it will return the values of those objects. The same is true for arrays. To remove these, filter out objects and array.

If `walk` gets a string, number, or boolean, it will yield a single object.

#### Arguments

walk: (any) -> array[walkObject]

#### Example

```js
const { walk } = require("saunter");
const subject = {
  name: "Jane Doe",
  email: "jdoe@example.com",
  address: {
    city: "New York",
    state: "New York",
    zip: "10101"
  }
};
const walker = walk(subject);
console.log([...walker]);
```

This prints:

```
[
  { path: ["name"], value: "Jane Doe" },
  { path: ["email"], value: "jdoe@example.com" },
  {
    path: ["address"],
    value: { city: "New York", state: "New York", zip: "10101" }
  },
  { path: ["address", "city"], value: "New York" },
  { path: ["address", "state"], value: "New York" },
  { path: ["address", "zip"], value: "10101" }
]
```

### `pathMatch`

Function for matching paths. This can be used for filtering or searching through data.

#### Arguments

The `pathMatch` function will return a function that takes a `walkObject`.

pathMatch: (array) -> (walkObject) -> boolean

The function can take an array of three types of values. A function can be provided as a way to do logic during a check.

1. string
1. integer
1. function: (string || integer) -> boolean

#### Examples

Matching strings and integers:

```js
const { pathMatch } = require("saunter");
const matcher = pathMatch(["foo", 1, "bar"]);
console.log(matcher(["foo", 1, "bar"]));
// prints true
```

Matching with functions:

```js
const { pathMatch } = require("saunter");
function isOdd(value) {
  return value % 2 !== 0;
}
const matcher = pathMatch(["foo", isOdd]);
console.log(matcher(["foo", 1]));
// prints true
```

### `pathStartsWith`

Similar to `pathMatch`, but only checks to see if the given path starts with the pattern given.

#### Arguments

Same as `pathMatch`.

#### Example

```js
const { pathStartsWith } = require("saunter");
const matcher = pathStartsWith(["foo"]);
console.log(matcher(["foo", 1, "bar"]));
// prints true
```

### `getPath`

Helper function to get the path from the `walkObject`.

#### Example

```js
const { getPath } = require("saunter");
getPath({ path: ["foo", 1], value: 42 });
// returns ["foo", 1]
```

### `getValue`

Helper function to get the value from the `walkObject`.

#### Example

```js
const { getValue } = require("saunter");
getValue({ path: ["foo", 1], value: 42 });
// returns 42
```
