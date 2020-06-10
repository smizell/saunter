const { expect } = require("chai");
const { walk, handlers } = require("../lib");
const lodash = require("lodash");

describe("Handlers", function() {
  describe("#when", function() {
    const { when } = handlers;
    const value = [1, 2, 3, 4, 5, 6];
    const cond = ({ value }) => value % 2 === 0;
    const trueFn = ({ value, result }) => {
      result.value.even.push(value);
      return result;
    };
    const falseFn = ({ value, result }) => {
      result.value.odd.push(value);
      return result;
    };
    context("condition is met", function() {
      it("returns the correct values", function() {
        const result = walk(value, [when(cond, trueFn, falseFn)], {
          initialResult: { even: [], odd: [] }
        });
        expect(result.value).to.deep.equal({
          even: [2, 4, 6],
          odd: [1, 3, 5]
        });
      });
    });
  });
});
