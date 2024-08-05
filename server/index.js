const dotenv = require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");

const dbConnect = require("./config/dbConnect");
const AppError = require("./utils/appError");
const sendResponse = require("./utils/sendResponse");
const errorGlobalMiddleware = require("./middlewares/errorMiddleware");
const authRoutes = require("./routes/userRoute");
const blogRoutes = require("./routes/blogRoute");
const commentRoutes = require("./routes/commentRoute");
const cacheRoutes = require("./routes/cacheRoute"); // Remove in production

const port = process.env.PORT || 7018;

const app = express();

app.set("trust proxy", 1); // Trust the first proxy in the chain

// Allow requests from specific origins
const corsOptions = {
  origin: process.env.CORS_ORIGIN,
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

// Set security HTTP headers
app.use(helmet());

// Rate limiter middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  handler: (req, res, next) =>
    next(new AppError("Too many requests, please try again later", 429)),
});

// Apply rate limiter to all requests
app.use(limiter);

// Enable compression
app.use(compression());

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Parse cookies from requests
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(hpp());

// Development APIs logging middleware
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Database connection
dbConnect(process.env.DATABASE_URI);

// health check
app.get("/", (req, res) => {
  sendResponse(res, 200, true, null, "Server is up and running...");
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/cache", cacheRoutes); // Remove in production

// 404 error handler for all other routes
app.all("*", (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);

// Global error handler
app.use(errorGlobalMiddleware);

// Server listening
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
