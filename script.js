
//TEST 
document.getElementById("predictBtn").addEventListener("click", () => {
  const ingredients = document.getElementById("ingredients").value.trim();
  const resultDiv = document.getElementById("result");

  if (!ingredients) {
    resultDiv.innerText = "Please enter some ingredients first!";
    return;
  }

  const predictions = [
    "You’ll probably enjoy this dish!",
    "This one might not suit your taste.",
    "Could be a hit with your flavor preferences!",
    "Not sure about this one, but give it a try!"
  ];
  
  const randomIndex = Math.floor(Math.random() * predictions.length);
  resultDiv.innerText = predictions[randomIndex];
});

