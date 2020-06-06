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
  constructor(checkResult, trueResult, falseResult) {
    this.checkResult = checkResult;
    this.trueResult = trueResult;
    this.falseResult = falseResult;
  }
}

function walk(
  givenValue,
  handlers = [],
  { breakWhen = () => false, result = new Result(), path = [] } = {}
) {
  let currentResult = result;
  if (isWalkable(givenValue)) {
    let cont = true;
    lodash.each(givenValue, (value, keyOrIndex) => {
      const currentPath = lodash.concat(path, keyOrIndex);
      lodash.each(handlers, ({ check, onTrue, onFalse }) => {
        if (!cont) return;
        const ctx = new Context();
        if (check(value, currentResult, currentPath)) {
          currentResult = onTrue(value, currentResult, path);
          ctx.checkPassed = true;
          ctx.trueResult = currentResult;
        } else {
          ctx.checkPassed = false;
          if (onFalse) {
            currentResult = onFalse(value, currentResult, path);
            ctx.falseResult = currentResult;
          }
        }
        if (breakWhen(ctx)) cont = false;
      });
      // This only goes deeper if no breakWhen stops us
      if (cont) {
        currentResult = walk(value, handlers, {
          result: currentResult,
          path: currentPath,
          breakWhen
        });
      }
    });
  }
  return currentResult;
}

function isWalkable(value) {
  return lodash.isPlainObject(value) || lodash.isArray(value);
}

module.exports = { walk, Result, Handler };
