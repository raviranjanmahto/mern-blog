const router = require("express").Router();
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

// Middleware to protect routes and require user authentication
router.use(authController.protect);

router.post("/post-comment/:id", commentController.postComment); // Add a comment to the blog post with the given ID
router.get("/total-comment", commentController.countComment); // Retrieve the count of all comments
router.get("/get-all-comment", commentController.getAllComment); // Get a list of all comments

module.exports = router;
