document.getElementById("predictBtn").addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value.trim();
  const resultDiv = document.getElementById("result");

  if (!ingredients) {
    resultDiv.innerText = "Please enter some ingredients!";
    return;
  }

  try {
    // Send ingredients to backend
    const response = await fetch("http://localhost:5001/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ingredients })
    });

    const data = await response.json();

    // Show the prediction briefly in the top result div
    resultDiv.innerText = `Suggested: ${data.name}`;

    // Add prediction as a food card at the top
    addFoodCard(
      data.name,
      data.ingredients,
      data.description,
      data.imageUrl || "https://via.placeholder.com/80",
      data.recipeUrl
    );
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
  // Insert new card at the top
  foodsDiv.prepend(card);
}
