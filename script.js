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
          { role: "user", content: `If I liked these ingredients ${ingredients} what food would you suggest for me? Try to be simple and include food that has the main ingredients but also try and include some food that might be a unique suggestion ` }
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
const foodsDiv = document.getElementById("Foods");

function addFoodCard(name, ingredients, description, imageUrl, recipeUrl) {
  const card = document.createElement("div");
  card.className = "food-card";
  card.innerHTML = `
    <img src="${imageUrl}" alt="${name}">
    <div class="food-info">
      <h3>${name}</h3>
      <p><strong>Main Ingredients:</strong> ${ingredients}</p>
      <p>${description}</p>
      <a href="${recipeUrl}" target="_blank">View Recipe</a>
    </div>
  `;
  foodsDiv.appendChild(card);
}
addFoodCard(
  "hello",
  "Pasta, Eggs, Cheese, Bacon",
  "A creamy Italian pasta dish with rich flavor.",
  "https://via.placeholder.com/80",
  "https://www.example.com/recipe"
);

