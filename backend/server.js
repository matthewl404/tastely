import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

if (!process.env.GOOGLE_API_KEY) {
  console.warn("WARNING: GOOGLE_API_KEY is not set in backend/.env");
}

const genai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_API_KEY
});

app.post("/predict", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ error: "No ingredients provided" });
  }

  try {
    const response = await genai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest a dish using these ingredients: ${ingredients}. Return strictly JSON with keys: name, ingredients, description, recipeUrl.`
    });

    console.log("Gemini raw response:", JSON.stringify(response, null, 2));

    const aiText =
      response.output_text?.trim() ||
      response.output?.[0]?.content?.text?.trim() ||
      response?.candidates?.[0]?.content?.text?.trim() ||
      "";


    let json;
    try {
      const match = aiText.match(/{[\s\S]*}/);
      const toParse = match ? match[0] : aiText;
      json = JSON.parse(toParse);
    } catch (parseErr) {
      console.warn("JSON parse failed, falling back to raw text:", parseErr.message);
      json = {
        name: aiText || "Unknown dish",
        ingredients,
        description: "Suggested by Gemini (raw output)",
        recipeUrl: "#"
      };
    }

    return res.json(json);

  } catch (err) {
    // Print full error in server logs (use this text to Google)
    console.error("Gemini API error (full):", err);
    // Provide useful info to frontend (status/message)
    return res.status(500).json({
      error: "AI error",
      message: err?.message || String(err)
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
