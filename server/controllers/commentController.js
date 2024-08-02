const catchAsync = require("../utils/catchAsync");
const Comment = require("../models/commentModel");
const sendResponse = require("../utils/sendResponse");
const cache = require("../utils/cache");

exports.postComment = catchAsync(async (req, res) => {
  const query = { ...req.body, userId: req.user._id, blogId: req.params.id };
  const newComment = new Comment(query);
  await newComment.save();

  // Delete the cache entry for the blog to ensure the comments are up to date
  cache.del(`blog:${req.params.id}`);

  sendResponse(res, 200, true, newComment);
});

exports.countComment = catchAsync(async (req, res) => {
  const totalComments = await Comment.countDocuments();

  sendResponse(res, 200, true, totalComments);
});

exports.getAllComment = catchAsync(async (req, res) => {
  const comments = await Comment.find().populate("userId", "name");

  sendResponse(res, 200, true, comments);
});
