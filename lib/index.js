const lodash = require("lodash");

module.exports = { walk };

function* walk(subject, path = []) {
  if (lodash.isPlainObject(subject)) {
    for (const prop in subject) {
      yield {
        path: lodash.concat(path, prop),
        value: subject[prop]
      };
    }
    for (const prop in subject) {
      yield* walk(subject[prop], lodash.concat(path, prop));
    }
  } else if (lodash.isArray(subject)) {
    for (const [idx, item] of subject.entries()) {
      yield {
        path: lodash.concat(path, idx),
        value: item
      };
    }
    for (const [idx, item] of subject.entries()) {
      yield* walk(item, lodash.concat(path, idx));
    }
  } else {
    return subject;
  }
}
