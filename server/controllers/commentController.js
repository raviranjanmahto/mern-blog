const catchAsync = require("../utils/catchAsync");
const Comment = require("../models/commentModel");
const sendResponse = require("../utils/sendResponse");
const cache = require("../utils/cache");

// Controller for adding a new comment to a specific blog post
exports.postComment = catchAsync(async (req, res) => {
  // Create a new comment with user ID and blog ID from request parameters
  const query = { ...req.body, userId: req.user._id, blogId: req.params.id };
  const newComment = new Comment(query);
  await newComment.save();

  // Invalidate the cache for the blog to ensure comments are up-to-date
  cache.del(`blog:${req.params.id}`);

  sendResponse(res, 200, true, newComment);
});

// Controller for getting the total number of comments
exports.countComment = catchAsync(async (req, res) => {
  // Count the total number of comments in the database
  const totalComments = await Comment.countDocuments();

  // Respond with the total count of comments
  sendResponse(res, 200, true, totalComments);
});

// Controller for retrieving all comments
exports.getAllComment = catchAsync(async (req, res) => {
  // Fetch all comments and populate user information
  const comments = await Comment.find().populate("userId", "name");

  // Respond with the list of all comments
  sendResponse(res, 200, true, comments);
});
