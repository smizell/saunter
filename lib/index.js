const R = require("ramda");
const RA = require("ramda-adjunct");

module.exports = {
  getPath,
  getValue,
  pathMatch,
  pathStartsWith,
  walk,
  updateWalk,
  collapse,
};

function* walk(subject, path = []) {
  if (RA.isArray(subject)) {
    for (const [idx, item] of subject.entries()) {
      if (RA.isPlainObj(item)) continue;
      yield {
        path: path.concat(idx),
        value: item,
      };
    }
    for (const [idx, item] of subject.entries()) {
      yield* walk(item, path.concat(idx));
    }
  } else if (RA.isPlainObj(subject)) {
    for (const prop in subject) {
      if (RA.isPlainObj(subject[prop]) || RA.isArray(subject[prop])) continue;
      yield {
        path: path.concat(prop),
        value: subject[prop],
      };
    }
    for (const prop in subject) {
      yield* walk(subject[prop], path.concat(prop));
    }
  }
  // If it's not an array or object and the path is [], we can yield
  // the value back with an empty path.
  else if (path.length === 0) {
    yield {
      path: [],
      value: subject,
    };
  }
}

function pathMatch(checks) {
  return function ({ path }) {
    if (checks.length !== path.length) return false;
    for (const [idx, check] of checks.entries()) {
      const result = pathMatchItem(check, path[idx]);
      if (!result) return false;
    }
    return true;
  };
}

function pathStartsWith(checks) {
  return function ({ path }) {
    if (checks.length > path.length) return false;
    for (const [idx, check] of checks.entries()) {
      const result = pathMatchItem(check, path[idx]);
      if (!result) return false;
    }
    return true;
  };
}

function pathMatchItem(check, item) {
  if (typeof check === "string" || check instanceof String) {
    if (check !== item) return false;
  } else if (Number.isInteger(check)) {
    if (check !== item) return false;
  } else if (typeof check === "function") {
    if (!check(item)) return false;
  } else {
    return false;
  }
  return true;
}

function getPath({ path }) {
  return path;
}

function getValue({ value }) {
  return value;
}

function updateWalk(subject, matchers, path = []) {
  if (RA.isPlainObj(subject)) {
    const acc = {};
    for (const prop in subject) {
      const newPath = path.concat(prop);
      const pathItem = {
        path: newPath,
        value: subject[prop],
      };
      acc[prop] = subject[prop];
      for (const matcher of matchers) {
        const check = matcher.match(pathItem, subject);
        if (check === true) {
          acc[prop] = matcher.handle(pathItem, subject);
        }
      }
    }
    for (const prop in acc) {
      const newPath = path.concat(prop);
      if (RA.isPlainObj(acc[prop]) || RA.isArray(acc[prop])) {
        acc[prop] = updateWalk(acc[prop], matchers, newPath);
      }
    }
    return acc;
  } else if (RA.isArray(subject)) {
    const acc = [];
    for (const [idx, item] of subject.entries()) {
      const newPath = path.concat(idx);
      const pathItem = {
        path: newPath,
        value: item,
      };
      acc[idx] = item;
      for (const matcher of matchers) {
        const check = matcher.match(pathItem, subject);
        if (check === true) {
          acc[idx] = matcher.handle(pathItem, subject);
        }
      }
    }
    for (const [idx, item] of subject.entries()) {
      const newPath = path.concat(idx);
      if (RA.isPlainObj(item) || RA.isArray(item)) {
        acc[idx] = updateWalk(item, matchers, newPath);
      }
    }
    return acc;
  } else {
    // It's just a value, so return it
    return subject;
  }
}

function collapse(items) {
  return R.reduce(
    (acc, { path, value }) => {
      return R.assocPath(path, value, acc);
    },
    [],
    items
  );
}
