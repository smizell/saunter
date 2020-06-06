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
function walk(initial, handlers = [], { breakWhen = () => false } = {}) {
  return walker(initial, initial, handlers, { breakWhen }, new Result(), []);
}

// Function for recursively walking
// The currentResult is replaced over and over, passed recursively,
// then finally returned as the final result.
function walker(initial, givenValue, handlers, options, result, path) {
  let currentResult = result;
  if (isWalkable(givenValue)) {
    // We'll use this to break out of iterating
    // If the breakWhen function returns true, this gets flipped to false
    let cont = true;
    lodash.each(givenValue, (value, keyOrIndex) => {
      const currentPath = lodash.concat(path, keyOrIndex);
      lodash.each(handlers, handler => {
        // Skip over handlers if breakWhen was true
        if (!cont) return;
        // For storing information about handler results
        const ctx = new Context();
        if (handler.check(value, currentResult, currentPath)) {
          currentResult = handler.onTrue(value, currentResult, path, initial);
          ctx.checkPassed = true;
          ctx.trueResult = currentResult;
        } else {
          ctx.checkPassed = false;
          if (handler.onFalse) {
            currentResult = handler.onFalse(
              value,
              currentResult,
              path,
              initial
            );
            ctx.falseResult = currentResult;
          }
        }
        // Allows for breaking out of iterating
        if (options.breakWhen(ctx)) cont = false;
      });
      // This only goes deeper if no breakWhen stops us
      if (cont) {
        // Value and path are current ones
        currentResult = walker(
          initial,
          value,
          handlers,
          options,
          currentResult,
          currentPath
        );
      }
    });
  }
  return currentResult;
}

function isWalkable(value) {
  return lodash.isPlainObject(value) || lodash.isArray(value);
}

module.exports = { walk, Result, Handler, Context };
