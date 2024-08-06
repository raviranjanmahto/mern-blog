const router = require("express").Router();

const AppError = require("../utils/appError");
const cache = require("../utils/cache");

// Route to retrieve all cache keys and their associated values
router.get("/", (req, res) => {
  const keys = cache.keys();
  const cacheData = keys.map(key => ({ key, value: cache.get(key) }));
  res.status(200).json({ status: true, cacheData });
});

// Route to retrieve the value of a specific cache key
router.get("/:key", (req, res, next) => {
  const key = req.params.key;
  const value = cache.get(key);
  if (!value) return next(new AppError("Cache key not found", 404));

  res.status(200).json({ status: true, key, value });
});

// Route to clear all cache entries
router.delete("/", (req, res) => {
  cache.flushAll();
  res.status(200).json({ status: true, message: "All cache cleared" });
});

module.exports = router;
