import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import * as genai from "@google/genai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/predict", async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) return res.status(400).json({ error: "No ingredients provided" });

  try {
  const response = await genai.models.text.generate({
  model: "gemini-2.5",
  apiKey: process.env.GEMINI_API_KEY,
  prompt: `Suggest a dish using these ingredients: ${ingredients}. Return strictly JSON with keys: name, ingredients, description, recipeUrl.`,
  max_output_tokens: 200
});

    });

    const aiText = response.output_text.trim();

    let json;
    try {
      json = JSON.parse(aiText);
    } catch {
      json = {
        name: aiText || "Unknown dish",
        ingredients,
        description: "Suggested by Gemini",
        recipeUrl: "#"
      };
    }

    res.json(json);
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({
      name: "Gemini Unavailable",
      ingredients,
      description: "Gemini API error",
      recipeUrl: "#"
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



