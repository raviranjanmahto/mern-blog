const router = require("express").Router();
const authController = require("../controllers/authController");

// Public routes for user authentication and management
router.post("/signup", authController.signup); // Route to handle user signup
router.post("/login", authController.login); // Route to handle user login
router.post("/forgot-password", authController.forgotPassword); // Route to handle forgot password request
router.patch("/reset-password/:token", authController.resetPassword); // Route to handle password reset using a token
router.get("/verify-email/:token", authController.verifyEmail); // Route to verify user email address using a token
router.post("/refresh-token", authController.refreshToken); // Route to refresh authentication token

// Middleware to protect routes that require authentication
router.use(authController.protect);

router.post("/logout", authController.logout); // Route to handle user logout
router.delete("/delete", authController.delete); // Route to delete user account
router.patch("/update-me", authController.updateMe); // Route to update user information
router.get("/get-me", authController.getMe); // Route to get current user information
router.patch("/update-password", authController.updatePassword); // Route to update user password

// Middleware to restrict access to admin-only routes
router.use(authController.protectRoles("admin"));

router.get("/all-users", authController.getAllUsers); // Route to get a list of all users (admin only)
router.get("/get-user", authController.getUser); // Route to get a user by ID (admin only)
router.patch("/update/:id", authController.updateUser); // Route to update a user by ID (admin only)

module.exports = router;
