const express = require("express");
const cors = require("cors");
require("dotenv").config();
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

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
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: `Suggest a food based on these ingredients: ${ingredients}` }
        ],
        max_tokens: 100
      })
    });
    const data = await response.json();
    res.json({ prediction: data.choices[0].message.content });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI error" });
  }
});

app.listen(5001, () => console.log("Server running on http://localhost:5001"));


