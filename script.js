document.getElementById("predictBtn").addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value.trim();
  const resultDiv = document.getElementById("result");

  if (!ingredients) {
    resultDiv.innerText = "Please enter some ingredients!";
    return;
  }

  const chatgpt = "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";

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${chatgpt}`
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "user", content: `Predict the taste for: ${ingredients}` }
        ],
        max_tokens: 100
      })
    });

    const data = await response.json();
    resultDiv.innerText = data.choices[0].message.content;
  } catch (error) {
    console.error(error);
    resultDiv.innerText = "AI Error. Please try again.";
  }
});
