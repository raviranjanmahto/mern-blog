const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const cache = require("../utils/cache");
const sendResponse = require("../utils/sendResponse");

exports.postNewBlog = catchAsync(async (req, res) => {
  const newBlog = new Blog({ ...req.body, author: req.user._id });
  await newBlog.save();

  // Delete the cache entries for the related blog and all blogs
  cache.del([`relatedBlogs:${req.params.id}`, "blogs"]);

  sendResponse(res, 200, true, newBlog);
});

exports.getAllBlog = catchAsync(async (req, res) => {
  const cachedBlogs = cache.get("blogs");
  if (cachedBlogs) return sendResponse(res, 200, true, cachedBlogs);

  const blogs = await Blog.find()
    .populate("author", "email")
    .sort({ createdAt: -1 });

  // Convert Mongoose documents to plain objects
  const plainBlogs = blogs.map(blog => blog.toObject());

  // cache the products
  cache.set("blogs", plainBlogs);

  sendResponse(res, 200, true, blogs);
});

exports.getSingleBlog = catchAsync(async (req, res, next) => {
  const blogId = req.params.id;
  const cachedBlog = cache.get(`blog:${blogId}`);
  if (cachedBlog)
    return sendResponse(res, 200, true, {
      blog: cachedBlog.blog,
      comments: cachedBlog.comments,
    });

  // Fetch blog and comments in parallel
  const [blog, comments] = await Promise.all([
    Blog.findById(blogId).populate("author", "name"),
    Comment.find({ blogId }).populate("userId", "name email"),
  ]);
  if (!blog) return next(new AppError("Blog not found", 404));

  // cache the blog
  const plainBlog = blog.toObject();
  const plainComments = comments.map(comment => comment.toObject());

  // Cache the blog and its comments
  cache.set(`blog:${blogId}`, { blog: plainBlog, comments: plainComments });

  sendResponse(res, 200, true, { blog: plainBlog, comments: plainComments });
});

exports.updateBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedBlog) return next(new AppError("Blog not found", 404));

  // Delete the cache entries for the deleted, related and all blogs
  cache.del([`blog:${id}`, `relatesBlogs:${id}`, "blogs"]);

  sendResponse(res, 200, true, updatedBlog);
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const deletedBlog = await Blog.findByIdAndDelete(id);
  if (!deletedBlog) return next(new AppError("Blog not found", 404));

  // Delete comments related to the blog
  await Comment.deleteMany({ blogId: id });

  // Delete the cache entries for the deleted, related and all blogs
  cache.del([`blog:${id}`, `relatesBlogs:${id}`, "blogs"]);

  sendResponse(res, 200, true, null, "Blog deleted successfully");
});

exports.getRelatedBlog = catchAsync(async (req, res, next) => {
  const id = req.params.id;
  const cachedBlogs = cache.get(`relatedBlogs:${id}`);
  if (cachedBlogs) return sendResponse(res, 200, true, cachedBlogs);

  const blog = await Blog.findById(id);
  if (!blog) return next(new AppError("Blog not found", 404));

  // Find related blogs by category and exclude the current blog
  const relatedBlogs = await Blog.find({
    _id: { $ne: id },
    category: blog.category,
  }).limit(4);

  // Convert Mongoose documents to plain objects
  const plainRelatedBlogs = relatedBlogs.map(blog => blog.toObject());

  // Cache the related blogs
  cache.set(`relatedBlogs:${id}`, plainRelatedBlogs);

  sendResponse(res, 200, true, relatedBlogs);
});
