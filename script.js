const foodsDiv = document.getElementById("Foods");

document.getElementById("predictBtn").addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value.trim();
  const resultDiv = document.getElementById("result");

  if (!ingredients) {
    resultDiv.innerText = "Please enter some ingredients!";
    return;
  }

  try {
    const response = await fetch("https://tastely-izes.onrender.com/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ingredients })
    });


    const data = await response.json();
    resultDiv.innerText = `Suggested: ${data.name}`;

    addFoodCard(
      data.name,
      data.ingredients,
      data.description,
      "https://via.placeholder.com/80",
      data.recipeUrl
    );
  } catch (error) {
    console.error(error);
    resultDiv.innerText = "AI Error. Please try again.";
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
