const router = require("express").Router();
const blogController = require("../controllers/blogController");
const authController = require("../controllers/authController");

// Public routes for accessing blog posts
router.get("/get-blog", blogController.getAllBlog); // Retrieve all blog posts
router.get("/get-blog/:id", blogController.getSingleBlog); // Retrieve a specific blog post by ID
router.get("/get-related-blog/:id", blogController.getRelatedBlog); // Retrieve related blog posts by ID

// Middleware to protect routes and require user authentication
router.use(authController.protect);

// Middleware to restrict access to routes for admin users only
router.use(authController.protectRoles("admin"));

router.post("/post-blog", blogController.postNewBlog); // Create a new blog post
router.patch("/update-blog/:id", blogController.updateBlog); // Update an existing blog post by ID
router.delete("/delete-blog/:id", blogController.deleteBlog); // Delete a blog post by ID

module.exports = router;
