const mongoose = require("mongoose");
const validator = require("validator");
const userMiddleware = require("../middleware/user");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const userSchma = new mongoose.Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: [true, "Please Enter Your Name"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastName: {
      type: String,
      trim: true,
      required: [true, "Please Enter Your lastName"],
    },
    email: {
      type: String,
      required: [true, "Plese Enter Email"],
      unique: true,
      validate: [validator.isEmail, "Please Enter valid Email"],
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Please Provide a Password"],
      minlength: 8,
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please Conirm Password"],
      validate: {
        validator: function (el) {
          return el === this.password;
        },
        message: "the Password is not Matched",
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },

    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "please provide a Phone Number"],
      match: [/^[0-9]{10,15}$/, "Please enter a valid phone number"],
    },
    profileImage: {
      type: String,
    },
  },
  { timestamps: true, versionKey: false }
);

userMiddleware(userSchma);
userSchma.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = Date.now() - 1000;
  next();
});
userSchma.pre(/^find/, function (next) {
  if (!this.getOptions().bypassFilter) {
    this.find({ active: { $ne: false } });
  }
  next();
});
userSchma.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};
userSchma.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};
userSchma.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};
const User = mongoose.model("User", userSchma);
module.exports = User;
