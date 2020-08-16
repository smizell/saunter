const { expect } = require("chai");
const { walk, collapse } = require("../lib");

describe("collapse", function () {
  it("collapses objects", function () {
    const subject = [
      {
        path: ["a"],
        value: 1,
      },
      {
        path: ["b"],
        value: 2,
      },
    ];
    expect(collapse(subject)).to.deep.eq({
      a: 1,
      b: 2,
    });
  });
  it("collapses arrays", function () {
    const subject = [
      {
        path: [0],
        value: 1,
      },
      {
        path: [1],
        value: 2,
      },
    ];
    expect(collapse(subject)).to.deep.eq([1, 2]);
  });
  it("handles round trip", function () {
    const subject = {
      a: 1,
      b: {
        c: 1,
        d: [1, 2, 3],
      },
    };
    expect(collapse([...walk(subject)])).to.deep.eq(subject);
  });
});
