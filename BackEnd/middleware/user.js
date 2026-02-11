const bcrypt = require("bcryptjs");

module.exports = function (schema) {
  schema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    next();
  });
};
