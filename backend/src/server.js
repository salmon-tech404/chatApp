import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./libs/moongoDB.js";
import authRoutes from "./routes/authRoutes.js";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();
connectDB();
const SERVER_PORT = process.env.SERVER_PORT;
app.use(express.json());
app.use(cookieParser());
// middlewares
app.get("/", (req, res) => {
  res.send("Hello Server!");
});

/* ---------- PUBLIC ROUTES ---------- */
app.use("/api/auth", authRoutes);

/* ---------- PRIVATE ROUTES ---------- */
// app.use("/api/users", authMiddleware, userRoutes);

app.listen(SERVER_PORT, () => {
  console.log(`Server is running on port ${SERVER_PORT}`);
});
