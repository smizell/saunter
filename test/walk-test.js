const { expect } = require("chai");
const { getValue, walk } = require("../lib");

describe("walk", function() {
  context("when subject is an object", function() {
    it("walks through each property", function() {
      const subject = {
        a: 1,
        b: 2,
        c: 3
      };
      const walker = walk(subject);
      const values = [...walker].map(getValue);
      expect(values).to.deep.equal([1, 2, 3]);
    });
    it("walks nested objects", function() {
      const subject = {
        a: 1,
        b: 2,
        c: {
          d: 3
        }
      };
      const walker = walk(subject);
      const values = [...walker].map(getValue);
      expect(values).to.deep.equal([1, 2, { d: 3 }, 3]);
    });
  });
  context("when subject is an array", function() {
    it("walks through each item", function() {
      const subject = [1, 2, 3];
      const walker = walk(subject);
      const values = [...walker].map(getValue);
      expect(values).to.deep.equal([1, 2, 3]);
    });
    it("walks nested objects", function() {
      const subject = [1, 2, { a: 3 }];
      const walker = walk(subject);
      const values = [...walker].map(getValue);
      expect(values).to.deep.equal([1, 2, { a: 3 }, 3]);
    });
  });
  context("when subject is not walkable", function() {
    it("returns the subject", function() {
      const subject = 42;
      const walker = walk(42);
      expect([...walker]).to.deep.equal([{ path: [], value: 42 }]);
    });
  });
});
