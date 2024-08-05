const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { signToken, sendCookieToken } = require("../utils/cookieToken");
const Email = require("../utils/sendEmail");
const sendResponse = require("../utils/sendResponse");

exports.signup = catchAsync(async (req, res, next) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password)
    return next(new AppError("All fields are required!"));

  const exUser = await User.findOne({ email });
  if (exUser)
    return next(new AppError("Email already in use, Please login.", 400));
  const user = await User.create({ name, email, password });

  // Generate a email reset token
  const resetToken = user.createToken("emailVerification");
  await user.save({ validateBeforeSave: false });

  const URL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/verify-email/${resetToken}`;

  // send welcome email
  await new Email(user, URL).sendWelcome();

  // Send JWT token with user info
  sendCookieToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("All fields are required!"));

  // Find user by email (assuming unique email)
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists and password is correct
  if (!user || !(await user.comparePassword(password)))
    return next(new AppError("Invalid email or password!", 401));

  // Send JWT token with user info
  sendCookieToken(user, 200, res);
});

exports.verifyEmail = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() }, // Token must be valid
  });

  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  // Set new password
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  user.emailVerified = true;
  await user.save({ validateBeforeSave: false });

  sendResponse(res, 200, true, null, "Email verified successfully");
});

exports.logout = catchAsync(async (req, res, next) => {
  // Clear cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure this is set to true in production
    sameSite: "strict", // Prevent CSRF attacks
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Send response
  sendResponse(res, 200, true, null, "Logged out successfully");
});

exports.delete = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  sendResponse(res, 200, true, null, "Deleted successfully");
});

exports.updateMe = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const user = req.user;

  if (!name && !email)
    return next(new AppError("No fields provided for update"), 400);

  if (name) user.name = name;
  if (email) user.email = email;

  await user.save({ validateModifiedOnly: true });

  sendResponse(res, 200, true, user, "Updated successfully");
});

exports.getMe = catchAsync(async (req, res, next) => {
  sendResponse(res, 200, true, req.user);
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  if (!email) return next(new AppError("Please provide an email!", 400));

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("No user found with that email!", 404));

  // Generate a password reset token
  const resetToken = user.createToken("passwordReset");
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/reset-password/${resetToken}`;

  // Send email with reset URL
  try {
    // Create instance of Email class and send password reset email
    await new Email(user, resetURL).sendPasswordReset();

    sendResponse(res, 200, true, null, "Token sent successfully");
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(new AppError("Error while sending password reset email", 500));
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const { newPassword } = req.body;
  if (!newPassword) return next(new AppError("Please provide all fields", 400));

  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Token must be valid
  });

  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  // Set new password
  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  sendResponse(res, 200, true, null, "Password updated successfully");
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  // Validate input
  if (!currentPassword || !newPassword)
    return next(new AppError("All fields are required!", 400));

  // Get user from the collection
  const user = await User.findById(req.user._id).select("+password");

  // Check if the current password is correct
  if (!(await user.comparePassword(currentPassword)))
    return next(new AppError("Your current password is incorrect!", 401));

  // Update password
  user.password = newPassword;
  await user.save();

  // Send JWT token with updated user info
  sendCookieToken(user, 200, res);
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  sendResponse(res, 200, true, users);
});

exports.updateUser = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) return next(new AppError("User not found!", 404));

  sendResponse(res, 200, true, updatedUser, "Updated successfully");
});

exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.accessToken;

  // Check if token exists
  if (!token) return next(new AppError("Please login to get access", 401));

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError("User no longer exists!", 401));

  // Check if user changed password after the token was issued!
  if (currentUser.changePasswordAfter(decoded.iat))
    return next(
      new AppError("User changed password recently. Please log in again", 401)
    );

  // Grant access to protected route
  req.user = currentUser;
  next();
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken)
    return next(new AppError("Please login to get access", 401));

  // Verify refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) return next(new AppError("User no longer exists!", 401));

  // Check if user changed password after the token was issued!
  if (currentUser.changePasswordAfter(decoded.iat))
    return next(
      new AppError("User changed password recently. Please log in again", 401)
    );

  // Generate new access token
  const newAccessToken = signToken(
    currentUser._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || "1d"
  );

  const newRefreshToken = signToken(
    currentUser._id,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN || "90d"
  );

  res.cookie("accessToken", newAccessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  });

  sendResponse(res, 200, true);
});

exports.protectRoles = (...allowedRoles) => {
  return catchAsync(async (req, res, next) => {
    if (!allowedRoles.includes(req.user.role))
      return next(new AppError("Unauthorized to access this route!", 403));
    next();
  });
};
