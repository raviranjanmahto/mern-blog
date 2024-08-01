const NodeCache = require("node-cache");
const myCache = new NodeCache();

const Blog = require("../models/blogModel");
const Comment = require("../models/commentModel");
const catchAsync = require("../utils/catchAsync");

exports.postNewBlog = catchAsync(async (req, res) => {
  const newBlog = new Blog({ ...req.body, author: req.user._id });
  await newBlog.save();

  // Delete the cache entries for the related blog and all blogs
  myCache.del([`relatedBlogs:${req.params.id}`, "blogs"]);

  res.status(200).json({ status: true, newBlog });
});

exports.getAllBlog = catchAsync(async (req, res) => {
  const cachedBlogs = myCache.get("blogs");
  if (cachedBlogs)
    return res.status(200).json({ status: true, blogs: cachedBlogs });

  const blogs = await Blog.find();

  // Convert Mongoose documents to plain objects
  const plainBlogs = blogs.map(blog => blog.toObject());

  // cache the products
  myCache.set("blogs", plainBlogs);

  res.status(200).json({ status: true, blogs });
});

exports.getSingleBlog = catchAsync(async (req, res) => {
  const blogId = req.params.id;
  const cachedBlog = myCache.get(`blog:${blogId}`);
  if (cachedBlog)
    return res.status(200).json({
      status: true,
      blog: cachedBlog.blog,
      comments: cachedBlog.comments,
    });

  // Fetch blog and comments in parallel
  const [blog, comments] = await Promise.all([
    Blog.findById(blogId).populate("author", "name"),
    Comment.find({ blogId }).populate("userId", "name email"),
  ]);
  if (!blog)
    return res.status(404).json({ status: false, message: "Blog not found" });

  // cache the blog
  const plainBlog = blog.toObject();
  const plainComments = comments.map(comment => comment.toObject());

  // Cache the blog and its comments
  myCache.set(`blog:${blogId}`, { blog: plainBlog, comments: plainComments });

  res
    .status(200)
    .json({ status: true, blog: plainBlog, comments: plainComments });
});

exports.updateBlog = catchAsync(async (req, res) => {
  const id = req.params.id;
  const updatedBlog = await Blog.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!updatedBlog)
    return res.status(404).json({ status: false, message: "Blog not found" });

  // Delete the cache entries for the deleted, related and all blogs
  myCache.del([`blog:${id}`, `relatesBlogs:{id}`, "blogs"]);

  res.status(200).json({ status: true, updatedBlog });
});

exports.deleteBlog = catchAsync(async (req, res) => {
  const id = req.params.id;
  const deletedBlog = await Blog.findByIdAndDelete(id);
  if (!deletedBlog)
    return res.status(404).json({ status: false, message: "Blog not found" });

  // Delete the cache entries for the deleted, related and all blogs
  myCache.del([`blog:${id}`, `relatesBlogs:{id}`, "blogs"]);

  res.status(200).json({ status: true, deletedBlog });
});

exports.getRelatedBlog = catchAsync(async (req, res) => {
  const id = req.params.id;
  const cachedBlogs = myCache.get(`relatedBlogs:${id}`);
  if (cachedBlogs)
    return res.status(200).json({ status: true, relatedBlogs: cachedBlogs });

  const blog = await Blog.findById(id);
  if (!blog)
    return res.status(404).json({ status: false, message: "Blog not found" });

  // Find related blogs by category and exclude the current blog
  const relatedBlogs = await Blog.find({
    _id: { $ne: id },
    category: blog.category,
  }).limit(4);

  // Convert Mongoose documents to plain objects
  const plainRelatedBlogs = relatedBlogs.map(blog => blog.toObject());

  // Cache the related blogs
  myCache.set(`relatedBlogs:${id}`, plainRelatedBlogs);

  res.status(200).json({ status: true, relatedBlogs });
});
