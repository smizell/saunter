const { expect } = require("chai");
const { walk, Handler, WalkResult } = require("../lib");
const lodash = require("lodash");

// Only collect values that aren't objects or arrays
const collectValues = new Handler({
  check: (value, _result, _path) => {
    if (lodash.isPlainObject(value) || lodash.isArray(value)) return false;
    return true;
  },
  onTrue: (value, result, _path) => {
    const newValue = lodash.concat(result.value || [], value);
    return new WalkResult(newValue);
  }
});

describe("Sauntering", function() {
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
  });
});
