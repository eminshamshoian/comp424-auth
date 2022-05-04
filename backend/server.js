import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import morgan from "morgan";
import compression from "compression";
import cors from "cors";
import path from "path";

// XSS Attack Protection
import xss from "xss-clean";

// SQL Attacks Protection
import mongoSanitize from "express-mongo-sanitize";

// middleware
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

// use morgan in development mode
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// connect to the mongoDB databases
connectDB();

/* make sure this comes before any routes */
app.use(xss());
app.use(express.json());
app.use(cors());
app.use(compression());
app.use(mongoSanitize());
app.use("/api/users", userRoutes);

const __dirname = path.resolve();

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/build")));

  app.use("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "frontend", "build", "index.html"))
  );
}

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
