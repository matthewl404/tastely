const express = require("express");
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
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "user",
            content: `Suggest a food based on these ingredients: ${ingredients}.
Strictly return a JSON object with these keys: name, ingredients, description, recipeUrl.
Do not include any extra text. Example: {"name":"Tacos","ingredients":"Beef, Tortilla","description":"Delicious tacos","recipeUrl":"https://example.com"}`
          }
        ],
        max_tokens: 200
      })
    });

    const data = await response.json();
    console.log("Raw AI response:", data);
    let aiText = data.choices?.[0]?.message?.content || "";

    // Try to extract JSON from the response
    let json;
    try {
      // Extract JSON substring if present
      const match = aiText.match(/{[\s\S]*}/);
      if (match) {
        json = JSON.parse(match[0]);
      } else {
        throw new Error("No JSON found");
      }
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



