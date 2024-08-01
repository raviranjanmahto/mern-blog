const router = require("express").Router();
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");

// Public routes
router.get("/get-blog", blogController.getAllBlog);
router.get("/get-blog/:id", blogController.getSingleBlog);
router.get("/get-related-blog/:id", blogController.getRelatedBlog);

// Login routes
router.use(authController.protect);

// Below routes only accessible by admin
router.use(authController.protectRoles("admin"));

router.post("/post-blog", blogController.postNewBlog);
router.patch("/update-blog/:id", blogController.updateBlog);
router.delete("/delete-blog/:id", blogController.deleteBlog);

module.exports = router;
