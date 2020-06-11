const { expect } = require("chai");
const { pathMatch } = require("../lib");

describe("pathMatch", function() {
  context("when lengths don't match", function() {
    it("returns false", function() {
      const path = ["foo", "bar"];
      const matcher = pathMatch(["foo"]);
      expect(matcher({ path })).to.be.false;
    });
  });
  context("when matching strings", function() {
    context("when there is a match", function() {
      it("returns true", function() {
        const path = ["foo"];
        const matcher = pathMatch(["foo"]);
        expect(matcher({ path })).to.be.true;
      });
    });
    context("when there isn't a match", function() {
      it("returns false", function() {
        const path = ["foo"];
        const matcher = pathMatch(["bar"]);
        expect(matcher({ path })).to.be.false;
      });
    });
  });
  context("when matching numbers", function() {
    context("when there is a match", function() {
      it("returns true", function() {
        const path = [1];
        const matcher = pathMatch([1]);
        expect(matcher({ path })).to.be.true;
      });
    });
    context("when there isn't a match", function() {
      it("returns false", function() {
        const path = [1];
        const matcher = pathMatch([2]);
        expect(matcher({ path })).to.be.false;
      });
    });
  });
  context("when the check is a function", function() {
    function isFoo(value) {
      return value === "foo";
    }
    context("when there is a match", function() {
      it("returns true", function() {
        const path = ["foo"];
        const matcher = pathMatch([isFoo]);
        expect(matcher({ path })).to.be.true;
      });
    });
    context("when there isn't a match", function() {
      it("returns false", function() {
        const path = ["bar"];
        const matcher = pathMatch([isFoo]);
        expect(matcher({ path })).to.be.false;
      });
    });
  });
});
