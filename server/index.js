// Handle uncaught exceptions
process.on("uncaughtException", err => {
  console.log("UNCAUGHT EXCEPTION!💥💥💥🙄💥💥💥 Shutting down... ");
  console.log(err.name, err.message);
  process.exit(1); // Exit the process to avoid inconsistent state
});

require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cors = require("cors");
const hpp = require("hpp");
const helmet = require("helmet");
const compression = require("compression");
const cookieParser = require("cookie-parser");
const mongoSanitize = require("express-mongo-sanitize");

const dbConnect = require("./config/dbConnect");
const AppError = require("./utils/appError");
const sendResponse = require("./utils/sendResponse");
const errorGlobalMiddleware = require("./middlewares/errorMiddleware");
const authRoutes = require("./routes/userRoute");
const blogRoutes = require("./routes/blogRoute");
const commentRoutes = require("./routes/commentRoute");
const cacheRoutes = require("./routes/cacheRoute");
const apiRateLimiter = require("./utils/apiRateLimiter");

const port = process.env.PORT || 7018;

const app = express();

// Configure Express to trust the first proxy
app.set("trust proxy", 1);

// Configure CORS to allow requests from specific origins
const corsOptions = {
  origin: true, // Allow requests from the same origin
  methods: ["GET", "POST", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials to be included in CORS requests
};

app.use(cors(corsOptions));

// Set security HTTP headers for improved security
app.use(helmet());

// Set up rate limiting for /api routes to prevent abuse
app.use("/api", apiRateLimiter());

// Enable compression for response bodies to improve performance
app.use(compression());

// Parse incoming JSON request bodies with a size limit
app.use(express.json({ limit: "10kb" }));

// Parse cookies from request headers
app.use(cookieParser());

// Sanitize user input to prevent NoSQL injection attacks
app.use(mongoSanitize());

// Prevent HTTP parameter pollution attacks
app.use(hpp());

// Log HTTP requests in development mode
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Connect to the MongoDB database
dbConnect(process.env.DATABASE_URI);

// Health check endpoint
app.get("/api/v1/ping", (req, res) => {
  sendResponse(res, 200, true, null, "Server is up and running...");
});

// Set up routes for various API endpoints
app.use("/api/v1/auth", apiRateLimiter(20), authRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);
app.use("/api/v1/cache", cacheRoutes);

// Serve the static files from the React app client side
app.use(express.static(path.join(__dirname, "../client/dist")));

// Serve the React client app
app.get("*", (req, res) =>
  res.sendFile(path.resolve(__dirname, "../client/dist", "index.html"))
);

// Handle 404 errors for all other routes
app.all("*", (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);

// Global error handling middleware
app.use(errorGlobalMiddleware);

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Server is listening on port ${port}...`));

// Handle unhandled promise rejections
process.on("unhandledRejection", err => {
  console.log("UNHANDLED REJECTION!💥💥💥🙄💥💥💥 Shutting down... ");
  console.error(err.name, err.message);
  process.exit(1); // Exit the process to avoid inconsistent state
});
