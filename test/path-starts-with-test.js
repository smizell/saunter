const { expect } = require("chai");
const { pathStartsWith } = require("../lib");

describe("pathStartsWith", function() {
  context("when the paths starts with the pattern", function() {
    it("returns true", function() {
      const path = ["foo", "bar", 1];
      const matcher = pathStartsWith(["foo", "bar"]);
      expect(matcher({ path })).to.be.true;
    });
  });
  context("when the paths doesn't start with the pattern", function() {
    it("returns false", function() {
      const path = ["foo", "biz", 1];
      const matcher = pathStartsWith(["foo", "bar"]);
      expect(matcher({ path })).to.be.false;
    });
  });
  context("when the path is too short", function() {
    it("returns false", function() {
      const path = ["foo"];
      const matcher = pathStartsWith(["foo", "bar"]);
      expect(matcher({ path })).to.be.false;
    });
  });
});
