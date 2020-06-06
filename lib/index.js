const lodash = require("lodash");

class Result {
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

class Context {
  constructor() {
    this.checkResult = undefined;
    this.trueResult = undefined;
    this.falseResult = undefined;
  }
}

// Main interface to walking
function walk(givenValue, handlers = [], { breakWhen = () => false } = {}) {
  return walker(
    givenValue,
    handlers,
    { breakWhen },
    {
      result: new Result(),
      path: []
    }
  );
}

// Function for recursively walking
function walker(givenValue, handlers, { breakWhen }, { result, path }) {
  let currentResult = result;
  if (isWalkable(givenValue)) {
    let cont = true;
    lodash.each(givenValue, (value, keyOrIndex) => {
      const currentPath = lodash.concat(path, keyOrIndex);
      lodash.each(handlers, handler => {
        // Skip over handlers if breakWhen was true
        if (!cont) return;
        // For storing information about handler results
        const ctx = new Context();
        if (handler.check(value, currentResult, currentPath)) {
          currentResult = handler.onTrue(value, currentResult, path);
          ctx.checkPassed = true;
          ctx.trueResult = currentResult;
        } else {
          ctx.checkPassed = false;
          if (handler.onFalse) {
            currentResult = handler.onFalse(value, currentResult, path);
            ctx.falseResult = currentResult;
          }
        }
        // Allows for breaking out of iterating
        if (breakWhen(ctx)) cont = false;
      });
      // This only goes deeper if no breakWhen stops us
      if (cont) {
        // Value and path are current ones
        currentResult = walker(
          value,
          handlers,
          { breakWhen },
          {
            result: currentResult,
            path: currentPath
          }
        );
      }
    });
  }
  return currentResult;
}

function isWalkable(value) {
  return lodash.isPlainObject(value) || lodash.isArray(value);
}

module.exports = { walk, Result, Handler };
