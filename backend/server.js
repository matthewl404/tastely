IMconst express = require("express");
const cors = require("cors");
require("dotenv").config();
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

// POST /predict endpoint
app.post("/predict", async (req, res) => {
  const { ingredients } = req.body;
  if (!ingredients) return res.status(400).json({ error: "No ingredients provided" });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GEMINI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: `Suggest a food based on these ingredients: ${ingredients}.
Return JSON with keys: name, ingredients, description, recipeUrl.`

          }
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();
let aiText = data.choices?.[0]?.message?.content || "";
let json;
try {
  json = JSON.parse(aiText);
} catch (e) {
  json = {
    name: aiText || "Unknown dish",
    ingredients,
    description: "Suggested by AI",
    recipeUrl: "#"
  };
}

    res.json(json);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));






