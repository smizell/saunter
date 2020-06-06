const lodash = require("lodash");

class WalkResult {
  constructor(value) {
    this.value = value;
  }
}

class Handler {
  constructor({ check, onTrue = (_value, result) => result, onFalse = null }) {
    this.check = check;
    this.onTrue = onTrue;
    this.onFalse = onFalse;
  }
}

function walk(
  givenValue,
  handlers = [],
  { result = new WalkResult(), path = [] } = {}
) {
  let currentResult = result;
  if (lodash.isPlainObject(givenValue) || lodash.isArray(givenValue)) {
    lodash.each(givenValue, (value, keyOrIndex) => {
      const currentPath = lodash.concat(path, keyOrIndex);
      lodash.each(handlers, ({ check, onTrue, onFalse }) => {
        if (check(value, currentResult, currentPath)) {
          currentResult = onTrue(value, currentResult, path);
        } else {
          if (onFalse) {
            currentResult = onFalse(value, currentResult, path);
          }
        }
      });
      currentResult = walk(value, handlers, {
        result: currentResult,
        path: currentPath
      });
    });
  }
  return currentResult;
}

module.exports = { walk, WalkResult, Handler };
