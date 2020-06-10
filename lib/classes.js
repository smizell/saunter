class Handler {
  constructor({ check, onTrue = ({ result }) => result, onFalse = null }) {
    this.check = check;
    this.onTrue = onTrue;
    this.onFalse = onFalse;
  }
}

module.exports = { Handler };
