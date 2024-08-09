const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const { signToken, sendCookieToken } = require("../utils/cookieToken");
const Email = require("../utils/sendEmail");
const sendResponse = require("../utils/sendResponse");

// Sign up a new user and send a verification email
exports.signup = catchAsync(async (req, res, next) => {
  const { email, name, password } = req.body;
  if (!email || !name || !password)
    return next(new AppError("All fields are required!"));

  // Check if the user already exists
  const exUser = await User.findOne({ email });
  if (exUser)
    return next(new AppError("Email already in use, Please login.", 400));

  // Create new user
  const user = await User.create({ name, email, password });

  // Generate an email verification token
  const token = user.createToken("emailVerification");
  await user.save({ validateBeforeSave: false });

  const URL = `${process.env.CLIENT_URL}/verify-email/${token}`;

  try {
    // Send welcome email asynchronously
    await new Email(user, URL).sendWelcome();
  } catch (error) {
    // If email sending fails, delete the user
    await User.findByIdAndDelete(user._id);

    // Send error response
    return next(
      new AppError("Fail to send email. Please try again later.", 500)
    );
  }
  sendCookieToken(user, 201, res);
});

// Log in a user and send a JWT token if email is verified
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError("All fields are required!"));

  // Find user by email and include password in the query
  const user = await User.findOne({ email }).select("+password");

  // Check if user exists and password is correct
  if (!user || !(await user.comparePassword(password)))
    return next(new AppError("Invalid email or password!", 401));

  // Send JWT token with user info if email is verified
  sendCookieToken(user, 200, res);
});

// Verify the user's email address using the token
exports.verifyEmail = catchAsync(async (req, res, next) => {
  const token = req.params.token;

  // Hash the token for comparison
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with the hashed token and check if token is still valid
  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  // Set email verification status and clear token
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  user.emailVerified = true;
  await user.save({ validateBeforeSave: false });

  // Send response indicating success
  sendResponse(res, 200, true, null, "Email verified successfully");
});

// Resend verification email
exports.resendVerificationEmail = catchAsync(async (req, res, next) => {
  const email = req.body.email;

  if (!email)
    return next(new AppError("Please provide your email address", 400));

  // Find the user by email
  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError("No user found with that email address", 404));

  // Check if the email is already verified
  if (user.emailVerified)
    return next(new AppError("Email already verified", 400));

  // Generate a new email verification token
  const token = user.createToken("emailVerification");
  await user.save({ validateBeforeSave: false });

  const URL = `${process.env.CLIENT_URL}/verify-email/${token}`;

  try {
    // Send new verification email asynchronously
    await new Email(user, URL).sendWelcome();
  } catch (error) {
    return next(
      new AppError(
        "Failed to send verification email. Please try again later.",
        500
      )
    );
  }

  sendResponse(res, 200, true, null, "Verification email sent successfully.");
});

// Log out the user by clearing cookies
exports.logout = catchAsync(async (req, res, next) => {
  // Clear access and refresh cookies
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Set to true in production
    sameSite: "strict", // Prevent CSRF attacks
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
  });

  // Send response indicating success
  sendResponse(res, 200, true, null, "Logged out successfully");
});

// Soft delete a user by setting active to false
exports.delete = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  // Send response indicating success
  sendResponse(res, 200, true, null, "Deleted successfully");
});

// Update the current user's profile information
exports.updateMe = catchAsync(async (req, res, next) => {
  const { name, email } = req.body;
  const user = req.user;

  // Check if fields are provided
  if (!name && !email)
    return next(new AppError("No fields provided for update"), 400);

  // Update user fields if provided
  if (name) user.name = name;
  if (email) user.email = email;

  await user.save({ validateModifiedOnly: true });

  // Send response indicating success
  sendResponse(res, 200, true, user, "Updated successfully");
});

// Get the current user's details
exports.getMe = catchAsync(async (req, res, next) => {
  sendResponse(res, 200, true, req.user);
});

// Handle forgot password by sending a reset token
exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  // Validate input
  if (!email) return next(new AppError("Please provide an email!", 400));

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) return next(new AppError("No user found with that email!", 404));

  // Generate a password reset token
  const token = user.createToken("passwordReset");
  await user.save({ validateBeforeSave: false });

  // Create reset URL
  const URL = `${process.env.CLIENT_URL}/reset-password/${token}`;

  // Send password reset email
  try {
    await new Email(user, URL).sendPasswordReset();

    // Send response indicating success
    sendResponse(res, 200, true, null, "Token sent successfully");
  } catch (err) {
    // Clear token and expiry if email sending fails
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    // Send error response
    return next(new AppError("Error while sending password reset email", 500));
  }
});

// Reset the user's password using the token
exports.resetPassword = catchAsync(async (req, res, next) => {
  const token = req.params.token;
  const password = req.body.password;
  if (!password) return next(new AppError("Please provide password", 400));

  // Hash the token for comparison
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find user with the hashed token and check if token is still valid
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError("Token is invalid or has expired", 400));

  // Set new password and clear reset token
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  // Send response indicating success
  sendResponse(res, 200, true, null, "Password updated successfully");
});

// Update the user's password with the current password
exports.updatePassword = catchAsync(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;
  // Validate input
  if (!currentPassword || !newPassword)
    return next(new AppError("All fields are required!", 400));

  // Find user and include password in query
  const user = await User.findById(req.user._id).select("+password");

  // Check if current password is correct
  if (!(await user.comparePassword(currentPassword)))
    return next(new AppError("Your current password is incorrect!", 401));

  // Update password
  user.password = newPassword;
  await user.save();

  // Send JWT token with updated user info
  sendCookieToken(user, 200, res);
});

// Get all users (admin access only)
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find({});
  sendResponse(res, 200, true, users);
});

// Get a specific user by ID (admin access only)
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError("No user found with that ID", 404));

  sendResponse(res, 200, true, user);
});

// Update user details by ID
exports.updateUser = catchAsync(async (req, res) => {
  const id = req.params.id;

  // Update user by ID with new data from the request body
  const updatedUser = await User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true, // Ensure that validation rules are applied
  });

  // If user not found, send an error response
  if (!updatedUser) return next(new AppError("User not found!", 404));

  // Send response with updated user details
  sendResponse(res, 200, true, updatedUser, "Updated successfully");
});

// Middleware to protect routes by checking if the user is authenticated
exports.protect = catchAsync(async (req, res, next) => {
  const token = req.cookies.accessToken;

  // Check if token exists
  if (!token) return next(new AppError("Please login to get access", 401));

  // Verify the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Find the user by ID from the token
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(
        "The user associated with this token no longer exists. Please log in again.",
        401
      )
    );
  // Check if the user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat))
    return next(
      new AppError("User changed password recently. Please log in again", 401)
    );

  // Attach the user to the request object for further use
  req.user = currentUser;
  next();
});

// Refresh access token using refresh token
exports.refreshToken = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  // Check if refresh token exists
  if (!refreshToken)
    return next(new AppError("Please login to get access", 401));

  // Verify the refresh token
  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

  // Find the user by ID from the token
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError(
        "The user associated with this token no longer exists. Please log in again.",
        401
      )
    );

  // Check if the user changed password after the token was issued
  if (currentUser.changePasswordAfter(decoded.iat))
    return next(
      new AppError("User changed password recently. Please log in again", 401)
    );

  // Generate new access and refresh tokens
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

  // Set new cookies with the new tokens
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

  // Send response with success
  sendResponse(res, 200, true);
});

// Middleware to restrict access to users with specific roles
exports.protectRoles = (...roles) => {
  return (req, res, next) => {
    // Check if the user's role is among the allowed roles
    if (!roles.includes(req.user.role))
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );

    next();
  };
};
