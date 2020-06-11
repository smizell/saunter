module.exports = { pathMatch, pathStartsWith, walk };

function* walk(subject, path = []) {
  if (Array.isArray(subject)) {
    for (const [idx, item] of subject.entries()) {
      yield {
        path: path.concat(idx),
        value: item
      };
    }
    for (const [idx, item] of subject.entries()) {
      yield* walk(item, path.concat(idx));
    }
  } else if (typeof subject === "object" && subject !== null) {
    for (const prop in subject) {
      yield {
        path: path.concat(prop),
        value: subject[prop]
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
      value: subject
    };
  }
}

function pathMatch(checks) {
  return function({ path }) {
    if (checks.length !== path.length) return false;
    for (const [idx, check] of checks.entries()) {
      const result = pathMatchItem(check, path[idx]);
      if (!result) return false;
    }
    return true;
  };
}

function pathStartsWith(checks) {
  return function({ path }) {
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
