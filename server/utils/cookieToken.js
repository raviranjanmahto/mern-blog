const jwt = require("jsonwebtoken");

// Function to generate a JWT token
const signToken = (id, secret, expiresIn) => {
  return jwt.sign({ id }, secret, { expiresIn });
};

// Function to send JWT tokens as cookies and respond with user data
const sendCookieToken = (user, statusCode, res) => {
  // Generate access token with a short expiration time
  const accessToken = signToken(
    user._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || "1d" // Default to 1 day if no expiration is set
  );

  // Generate refresh token with a longer expiration time
  const refreshToken = signToken(
    user._id,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN || "90d" // Default to 90 days if no expiration is set
  );

  // Define options for the cookies
  const cookieOptions = {
    httpOnly: true, // Cookie is only accessible via HTTP(S), not JavaScript
    secure: process.env.NODE_ENV === "production", // Set secure flag only in production
    sameSite: "strict", // Prevents CSRF attacks by restricting cross-site request
  };

  // Set access token cookie to expire in 24 hours
  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
  });

  // Set refresh token cookie to expire in 90 days
  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
  });

  // Respond with the status code, access token, and user data
  res.status(statusCode).json({ status: true, accessToken, user });
};

module.exports = { signToken, sendCookieToken };
