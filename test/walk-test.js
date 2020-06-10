const { expect } = require("chai");
const { walk } = require("../lib");
const R = require("ramda");

describe("walk", function() {
  context("when subject is an object", function() {
    it("walks through each property", function() {
      const subject = {
        a: 1,
        b: 2,
        c: 3
      };
      const walker = walk(subject);
      const values = R.map(R.prop("value"), [...walker]);
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
      const values = R.map(R.prop("value"), [...walker]);
      expect(values).to.deep.equal([1, 2, { d: 3 }, 3]);
    });
  });
  context("when subject is an array", function() {
    it("walks through each item", function() {
      const subject = [1, 2, 3];
      const walker = walk(subject);
      const values = R.map(R.prop("value"), [...walker]);
      expect(values).to.deep.equal([1, 2, 3]);
    });
    it("walks nested objects", function() {
      const subject = [1, 2, { a: 3 }];
      const walker = walk(subject);
      const values = R.map(R.prop("value"), [...walker]);
      expect(values).to.deep.equal([1, 2, { a: 3 }, 3]);
    });
  });
});
