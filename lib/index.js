module.exports = { walk };

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
  } else {
    return subject;
  }
}
