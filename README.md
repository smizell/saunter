# Saunter

Walk through data. Do things as you go.

## Install

```sh
npm install saunter
```

## Usage

Saunter is meant to be used with libraries like [Ramda](https://ramdajs.com/), [Transducers.js](https://github.com/cognitect-labs/transducers-js), or [Lodash](https://lodash.com/).

### `walk`

The `walk` function takes an object or array and walks through it. Calling `walk` will return a generator that can be iterated over. The generator yields a function for every value it finds.

- `path` (array) - The path to the value. It will be an array of object properties and array indexes.
- `value` (any) - The value for the given path.

Note: this will find every value, even objects. This means you will get a value for an object and then values for each property in the object.

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

```js
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
];
```
