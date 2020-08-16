const { expect } = require("chai");
const { updateWalk, pathMatch } = require("../lib");
const R = require("ramda");

describe("updateWalk", function () {
  context("when walking a shallow object", function () {
    it("updates on a match", function () {
      const value = {
        a: 1,
        b: 2,
        c: 3,
        d: 4,
      };
      const result = updateWalk(value, [
        {
          match: ({ value }) => {
            return value % 2 === 0;
          },
          handle: ({ value }) => {
            return value * 10;
          },
        },
        {
          match: pathMatch(["a"]),
          handle: () => "a",
        },
      ]);
      expect(result).to.deep.eq({
        a: "a",
        b: 20,
        c: 3,
        d: 40,
      });
    });
  });
  context("when walking nested objects", function () {
    it("updates on a match", function () {
      const value = {
        a: 1,
        b: {
          c: 2,
          d: [4, { e: 42 }, 7],
        },
      };
      const result = updateWalk(value, [
        {
          match: ({ value }) => {
            return value % 2 === 0;
          },
          handle: ({ value }) => {
            return value * 10;
          },
        },
        {
          match: pathMatch(["a"]),
          handle: () => "a",
        },
        {
          // Testing out a deeply nested path with function
          match: pathMatch(["b", "d", R.T, "e"]),
          handle: () => "life",
        },
      ]);
      expect(result).to.deep.eq({
        a: "a",
        b: {
          c: 20,
          d: [40, { e: "life" }, 7],
        },
      });
    });
  });
  context("when walking shallow array", function () {
    it("updates on match", function () {
      const value = [1, 2, 3, 4];
      const result = updateWalk(value, [
        {
          match: ({ value }) => {
            return value % 2 === 0;
          },
          handle: ({ value }) => {
            return value * 10;
          },
        },
        {
          match: pathMatch([0]),
          handle: () => "a",
        },
      ]);
      expect(result).to.deep.eq(["a", 20, 3, 40]);
    });
  });
});
