const { expect } = require("chai");
const { match, pathMatch } = require("../lib");

describe("Match", function() {
  it("runs the function for the first match", function() {
    const matcher = match([
      [pathMatch(["foo"]), () => 1],
      [pathMatch(["bar"]), () => 2],
      [pathMatch(["biz"]), ({ value }) => value]
    ]);
    expect(matcher({ path: ["biz"], value: 42 })).to.equal(42);
  });
});
