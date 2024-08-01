const router = require("express").Router();
const commentController = require("../controllers/commentController");
const authController = require("../controllers/authController");

// Login routes
router.use(authController.protect);

router.post("/post-comment/:id", commentController.postComment);
router.get("/total-comment", commentController.countComment);
router.get("/get-all-comment", commentController.getAllComment);

module.exports = router;
