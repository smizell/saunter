const { Handler } = require("./classes");

function when(check, onTrue, onFalse) {
  return new Handler({ check, onTrue, onFalse });
}

module.exports = { when };
