document.getElementById("predictBtn").addEventListener("click", async () => {
  const ingredients = document.getElementById("ingredients").value.trim();
  const resultDiv = document.getElementById("result");

  if (!ingredients) {
    resultDiv.innerText = "Please enter some ingredients!";
    return;
  }

  try {
    const response = await fetch("http://localhost:5001/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ ingredients })
    });

    const data = await response.json();
    resultDiv.innerText = data.prediction;
  } catch (error) {
    console.error(error);
    resultDiv.innerText = "AI Error. Please try again.";
  }
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

