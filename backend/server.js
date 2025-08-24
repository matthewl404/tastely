const foodsDiv = document.getElementById("Foods");

document.getElementById("predictBtn").addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value.trim();
  const resultDiv = document.getElementById("result");

  if (!ingredients) {
    resultDiv.innerText = "Please enter some ingredients!";
    return;
  }

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients })
    });

    const data = await response.json();

    const dishName = data.name || "Unknown dish";
    const dishIngredients = data.ingredients || ingredients;
    const dishDescription = data.description || "Suggested by AI";
    const dishRecipeUrl = data.recipeUrl || "#";

    resultDiv.innerText = `Suggested: ${dishName}`;

    addFoodCard(dishName, dishIngredients, dishDescription, "https://via.placeholder.com/80", dishRecipeUrl);

  } catch (err) {
    console.error("Error fetching prediction:", err);
    resultDiv.innerText = "Error contacting AI. Please try again later.";
  }
});

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
  foodsDiv.prepend(card);
}
