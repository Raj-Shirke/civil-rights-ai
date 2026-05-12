import express from "express";
import { handleLegalChat } from "../controllers/aiController.js";

const router = express.Router();

// This defines the path: POST http://localhost:5000/api/ai/chat
router.post("/chat", handleLegalChat);

export default router;
