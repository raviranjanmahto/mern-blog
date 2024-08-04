const jwt = require("jsonwebtoken");

const signToken = (id, secret, expiresIn) => {
  return jwt.sign({ id }, secret, { expiresIn });
};

const sendCookieToken = (user, statusCode, res) => {
  const accessToken = signToken(
    user._id,
    process.env.JWT_SECRET,
    process.env.JWT_EXPIRES_IN || "1d"
  );

  const refreshToken = signToken(
    user._id,
    process.env.JWT_REFRESH_SECRET,
    process.env.JWT_REFRESH_EXPIRES_IN || "90d"
  );

  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Ensure secure flag is used only in production
    sameSite: "strict", // Prevent CSRF attacks
  };

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  }); // 24 hours

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
  }); // 90 days

  res.status(statusCode).json({ status: true, accessToken, user });
};

module.exports = { signToken, sendCookieToken };
