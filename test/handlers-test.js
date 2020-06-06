const { expect } = require("chai");
const { handlers } = require("../lib");
const lodash = require("lodash");

describe.skip("Handlers", function() {
  describe("#when", function() {
    let { when } = handlers;
    context("condition is met", function() {
      it("calls and returns the true function", function() {
        let cond = value => value % 2 === 0;
      });
    });
  });
});
