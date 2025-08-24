const express = require("express");
require("dotenv").config(); 
const { Client } = require("@google/genai");

const app = express();
app.use(express.json());
app.use(require("cors")());

// Initialize Gemini client
const client = new Client({ apiKey: process.env.GEMINI_API_KEY });

// Test route
app.get("/", (req, res) => {
  res.send("tastely backend working");
});

// /predict endpoint
app.post("/predict", async (req, res) => {
  const { ingredients } = req.body;

  if (!ingredients) {
    return res.status(400).json({ error: "No ingredients provided." });
  }

  try {
    // Call Gemini API
    const response = await client.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Suggest a dish using the following ingredients: ${ingredients}.
Return strictly a JSON object with keys: name, ingredients, description, recipeUrl.`
    });

    const aiText = response.text.trim();

    // Try to parse JSON, fallback if parsing fails
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
      description: "AI error, Please try again later.",
      recipeUrl: "#"
    });
  }
});

// Use dynamic port for Render
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
