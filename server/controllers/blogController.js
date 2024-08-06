const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const cache = require("../utils/cache");
const sendResponse = require("../utils/sendResponse");

// Handler to create a new blog post
exports.postNewBlog = catchAsync(async (req, res) => {
  const newBlog = new Blog({ ...req.body, author: req.user._id });
  await newBlog.save();

  // Clear cache related to blogs and related blogs
  cache.del([`relatedBlogs:${req.params.id}`, "blogs"]);

  sendResponse(res, 200, true, newBlog);
});

// Handler to retrieve all blog posts
exports.getAllBlog = catchAsync(async (req, res) => {
  const cachedBlogs = cache.get("blogs");
  if (cachedBlogs) return sendResponse(res, 200, true, cachedBlogs);

  const blogs = await Blog.find()
    .populate("author", "email")
    .sort({ createdAt: -1 });

  // Convert to plain objects for caching
  const plainBlogs = blogs.map(blog => blog.toObject());

  // Cache the blog posts
  cache.set("blogs", plainBlogs);

  sendResponse(res, 200, true, blogs);
});

// Handler to retrieve a single blog post and its comments
exports.getSingleBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const cachedBlog = cache.get(`blog:${blogId}`);
  if (cachedBlog)
    return sendResponse(res, 200, true, {
      blog: cachedBlog.blog,
      comments: cachedBlog.comments,
    });

  // Fetch blog post and comments concurrently
  const [blog, comments] = await Promise.all([
    Blog.findById(blogId).populate("author", "name"),
    Comment.find({ blogId }).populate("userId", "name email"),
  ]);
  if (!blog) return next(new AppError("Blog not found", 404));

  // Convert to plain objects for caching
  const plainBlog = blog.toObject();
  const plainComments = comments.map(comment => comment.toObject());

  // Cache the blog post and comments
  cache.set(`blog:${blogId}`, { blog: plainBlog, comments: plainComments });

  sendResponse(res, 200, true, { blog: plainBlog, comments: plainComments });
});

// Handler to update an existing blog post
exports.updateBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedBlog) return next(new AppError("Blog not found", 404));

  // Clear cache for updated blog and related blogs
  cache.del([`blog:${id}`, `relatesBlogs:${id}`, "blogs"]);

  sendResponse(res, 200, true, updatedBlog);
});

// Handler to delete a blog post and associated comments
exports.deleteBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedBlog = await Blog.findByIdAndDelete(id);
  if (!deletedBlog) return next(new AppError("Blog not found", 404));

  // Remove associated comments
  await Comment.deleteMany({ blogId: id });

  // Clear cache for deleted blog and related blogs
  cache.del([`blog:${id}`, `relatesBlogs:${id}`, "blogs"]);

  sendResponse(res, 200, true, null, "Blog deleted successfully");
});

// Handler to retrieve related blog posts based on category
exports.getRelatedBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cachedBlogs = cache.get(`relatedBlogs:${id}`);
  if (cachedBlogs) return sendResponse(res, 200, true, cachedBlogs);

  const blog = await Blog.findById(id);
  if (!blog) return next(new AppError("Blog not found", 404));

  // Find related blogs in the same category excluding the current blog
  const relatedBlogs = await Blog.find({
    _id: { $ne: id },
    category: blog.category,
  }).limit(4);

  // Convert to plain objects for caching
  const plainRelatedBlogs = relatedBlogs.map(blog => blog.toObject());

  // Cache related blogs
  cache.set(`relatedBlogs:${id}`, plainRelatedBlogs);

  sendResponse(res, 200, true, relatedBlogs);
});
