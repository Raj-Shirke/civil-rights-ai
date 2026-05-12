import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import aiRoutes from "./routes/aiRoutes.js";

// Load environment variables
dotenv.config();

const app = express();

// 1. Middleware
// CORS allows your React app (on port 5173) to talk to this server (on port 5000)
app.use(cors());

// Essential for parsing JSON "message" bodies from the frontend
app.use(express.json());

// 2. Routes
// All AI-related requests will start with /api/ai
app.use("/api/ai", aiRoutes);

// 3. Health Check
// This lets you test in the browser if the server is alive
app.get("/", (req, res) => {
  res.send("Civil Rights AI Server is Running and CORS is enabled.");
});

// 4. Server Listener
const PORT = process.env.PORT || 5000;

// Adding '0.0.0.0' tells the server to listen on all network interfaces
app.listen(PORT, "0.0.0.0", () => {
  console.log(
    `🚀 Server spinning and accessible on your hotspot network at Port ${PORT}`,
  );
});
