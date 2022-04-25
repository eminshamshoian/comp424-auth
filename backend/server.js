import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan"; // show the API endpoints
import compression from "compression"; // use gzip compression in the express server
import cors from "cors"; // allow cross origin requests
import cookieSession from "cookie-session"; // for implementing cookie sessions for passport
import path from "path";

// middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// use morgan in development mode
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// connect to the mongoDB database
connectDB();

app.use(express.json()); // middleware to use req.body
app.use(cors()); // to avoid CORS errors
app.use(compression()); // to use gzip

// use cookie sessions
app.use(
  cookieSession({
    maxAge: 1000 * 60 * 60 * 24, // 1 day
    keys: [process.env.COOKIE_SESSION_KEY],
  })
);
// configure all the routes
app.use("/api/users", userRoutes);

const __dirname = path.resolve();

// To prepare for deployment
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.use("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

// middleware to act as fallback for all 404 errors
app.use(notFound);

// configure a custome error handler middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);