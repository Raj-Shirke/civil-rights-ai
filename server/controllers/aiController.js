import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

dotenv.config();

// 1. Let's force the key check right here
const myApiKey = process.env.GOOGLE_API_KEY;

if (!myApiKey) {
  console.error("❌ CRITICAL ERROR: GOOGLE_API_KEY is not found in .env file!");
}

const chat = new ChatGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "gemini-3-flash-preview", // Adding '-preview'
  maxOutputTokens: 2048,
});

export const handleLegalChat = async (req, res) => {
  const { message } = req.body;
  console.log("📩 Received:", message);

  try {
    const response = await chat.invoke([
      [
        "system",
        `You are an expert Indian Legal Assistant. 
    Your knowledge is based strictly on the Constitution of India, 
    Indian Labor Laws, and landmark Supreme Court judgments.
    
    Key focus areas:
    - Fundamental Rights (Articles 14, 15, 16, 19, 21).
    - POSH Act (Sexual Harassment of Women at Workplace, 2013).
    - Rights against discrimination based on Religion, Race, Caste, Sex, or Place of Birth.
    - Remedies: Article 32 (Supreme Court) and Article 226 (High Court).
    
    Disclaimer: You provide legal information for educational purposes, not professional legal advice. Always advise consulting a Vakil (Lawyer).`,
      ],
      ["user", message],
    ]);

    res.json({ success: true, reply: response.content });
  } catch (error) {
    console.error("❌ AI Error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};
