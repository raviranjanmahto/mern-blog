const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const AppError = require("../utils/appError");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please tell us your first name!"],
      maxlength: [50, "Name cannot be more than 50 characters"],
    },
    email: {
      type: String,
      required: [true, "Please tell us your email"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Please fill a valid email address",
      ],
    },
    password: {
      type: String,
      minlength: [6, "Password must be at least 6 characters"],
      required: [true, "Password is required!"],
      select: false,
    },
    passwordChangeAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    emailVerificationToken: {
      type: String,
      select: false, // Hide email verification token in queries
    },
    emailVerificationExpires: {
      type: Date,
      select: false, // Hide email verification expiration in queries
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  { timestamps: true }
);

// Pre-save middleware to hash the password before saving
userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  // Hash the password with cost of 11
  this.password = await bcrypt.hash(this.password, 11);

  if (this.isModified("password") && !this.isNew)
    this.passwordChangeAt = Date.now() - 1000; // Ensure the token is created after this time

  next();
});

// Method to compare password during login
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Only find active users
userSchema.pre(/^find/, async function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.createToken = function (type, next) {
  // Generate a random token
  const token = crypto.randomBytes(32).toString("hex");

  // Create a unique hash based on the token string alone
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Set token and expiry based on the type
  if (type === "passwordReset") {
    this.passwordResetToken = hashedToken;
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    return token;
  } else if (type === "emailVerification") {
    this.emailVerificationToken = hashedToken;
    this.emailVerificationExpires = Date.now() + 24 * 60 * 60 * 1000; // Token expires in 24 hours
    return token;
  } else {
    return next(new AppError("Invalid token type: " + type, 400));
  }
};

// Method to check if the token is valid
userSchema.methods.changePasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangeAt)
    return JWTTimestamp < this.passwordChangeAt.getTime() / 1000;

  // False means no change
  return false;
};

// Virtual to hide certain fields when converting to JSON
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.role;
  delete userObject.active;
  delete userObject.updatedAt;
  delete userObject.emailVerified;
  delete userObject.passwordChangeAt;
  delete userObject.__v;
  return userObject;
};

module.exports = mongoose.model("User", userSchema);
