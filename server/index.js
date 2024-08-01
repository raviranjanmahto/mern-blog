const dotenv = require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const dbConnect = require("./config/dbConnect");
const AppError = require("./utils/appError");
const errorGlobalMiddleware = require("./middlewares/errorMiddleware");
const authRoutes = require("./routes/userRoute");
const blogRoutes = require("./routes/blogRoute");
const commentRoutes = require("./routes/commentRoute");

const port = process.env.PORT || 7018;

const app = express();

// Allow requests from specific origins
const corsOptions = {
  origin: ["https://raviranjan-flipkart.vercel.app", "http://localhost:5173"],
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // Allow credentials
};

app.use(cors(corsOptions));

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));

// Parse cookies from requests
app.use(cookieParser());

// Development APIs logging middleware
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// Database connection
dbConnect(process.env.DATABASE_URI);

// health check
app.get("/", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is up and running...",
  });
});

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);

// 404 error handler for all other routes
app.all("*", (req, res, next) =>
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404))
);

// Global error handler
app.use(errorGlobalMiddleware);

// Server listening
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
