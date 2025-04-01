import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";

dotenv.config();

//MongoDB Connection
mongoose.connect(process.env.DB_URL).then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log(err);
  });

  const app = express();
  app.use(cookieParser());
  app.use(express.json());

  app.use(
    cors({
        origin: "http://localhost:5174",
        credentials: true, 
    })
);

app.listen(5050, () => {
    console.log("server listening on port 5050");
  });

// Routes
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);