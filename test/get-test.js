const { expect } = require("chai");
const { getPath, getValue } = require("../lib");

describe("Get", function() {
  describe("getPath", function() {
    it("returns the path", function() {
      expect(getPath({ path: ["foo"] })).to.deep.equal(["foo"]);
    });
  });
  describe("getValue", function() {
    it("returns the value", function() {
      expect(getValue({ value: 42 })).to.deep.equal(42);
    });
  });
});
