// Import dependencies
import express from "express";
import cors from "cors";
import morgan from "morgan";
import { connectToDB } from "./config/database.js";
import dotenv from "dotenv";
import allRoutes from "./routes/index.js";
dotenv.config({ path: "./config/.env" });

// Create an express app
const app = express();

// Routes
app.use("/api", allRoutes);

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Connect to database
connectToDB();

// Start server
app.listen(process.env.PORT, () =>
  console.log(`Server is running on port ${process.env.PORT}`)
);
