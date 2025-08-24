const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { Client } = require("@google/genai");

const app = express();
app.use(cors());
app.use(express.json());

const client = new Client({ apiKey: process.env.GEMINI_API_KEY });

app.post("/predict", async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) return res.status(400).json({ error: "No ingredients provided" });

  try {
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest a dish using these ingredients: ${ingredients}. Return JSON with name, ingredients, description, recipeUrl.`
    });

    const aiText = response.text.trim();

    let json;
    try {
      json = JSON.parse(aiText);
    } catch {
      json = {
        name: aiText || "Unknown dish",
        ingredients,
        description: "Suggested by AI",
        recipeUrl: "#"
      };
    }

    res.json(json);
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({
      name: "AI Unavailable",
      ingredients,
      description: "Gemini API error",
      recipeUrl: "#"
    });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
