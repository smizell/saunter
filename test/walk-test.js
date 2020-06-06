const { expect } = require("chai");
const { walk, Handler, Result } = require("../lib");
const lodash = require("lodash");

// Only collect values that aren't objects or arrays
const collectValues = new Handler({
  check: ({ value }) => {
    if (lodash.isPlainObject(value) || lodash.isArray(value)) return false;
    return true;
  },
  onTrue: ({ value, result }) => {
    const newValue = lodash.concat(result.value || [], value);
    return new Result(newValue);
  }
});

const collectOdds = new Handler({
  // Match
  check: ({ value }) => {
    return value % 2 == 0;
  },
  onFalse: ({ value, result }) => {
    const newValue = lodash.concat(result.value || [], value);
    return new Result(newValue);
  }
});

describe("Walking", function() {
  context("collecting", function() {
    it("walks objects", function() {
      const value = {
        foo: 1,
        baz: 2
      };
      const result = walk(value, [collectValues]);
      expect(result.value).to.deep.equal([1, 2]);
    });

    it("walks arrays", function() {
      const value = [
        {
          foo: 1,
          baz: 2
        },
        3
      ];
      const result = walk(value, [collectValues]);
      expect(result.value).to.deep.equal([1, 2, 3]);
    });

    it("follows nested objects", function() {
      const value = {
        foo: 1,
        baz: 2,
        bar: {
          biz: 3
        }
      };
      const result = walk(value, [collectValues]);
      expect(result.value).to.deep.equal([1, 2, 3]);
    });

    it("follows nested arrays", function() {
      const value = {
        foo: 1,
        baz: 2,
        bar: [
          {
            biz: 3,
            buz: 4
          }
        ]
      };
      const result = walk(value, [collectValues]);
      expect(result.value).to.deep.equal([1, 2, 3, 4]);
    });

    it("breaks when applicable", function() {
      const value = [1, 2, 3, 4, 5];
      const result = walk(value, [collectValues], {
        breakWhen: c => c.checkPassed
      });
      expect(result.value).to.deep.equal([1]);
    });
  });

  context("Handler", function() {
    it("runs onFalse", function() {
      const value = [1, 2, 3, 4];
      const result = walk(value, [collectOdds]);
      expect(result.value).to.deep.equal([1, 3]);
    });
  });
});
