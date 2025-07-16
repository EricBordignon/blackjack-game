async function getCard(URL, currentPlayer){
  try {
    const answer = await fetch(`/${URL}`);
    if (!answer.ok) {
      const errorData = await response.json();
      alert(errorData.message); 
      return;
    }

    const cardsImg = await answer.json(); 
    console.log("Cards received:", cardsImg);

    // DOM manipulation here
    cardsImg.cards.forEach(card => {
      const cardTemplate = document.createElement("div");
      cardTemplate.classList.add("card-container");

      console.log(card);
      cardTemplate.innerHTML = `
        <img src="${card}" alt="card" class="card" onerror="console.log('Erro ao carregar imagem')">
      `;
      if (currentPlayer === "user") {
        document.querySelector(".user-cards").appendChild(cardTemplate); 
        document.querySelector("#user-points").innerHTML = `Points: ${cardsImg.points}`;
        
        if (URL === "draw") {
          document.querySelector("#draw").classList.add("hidden");
          document.querySelector("#hit-me").classList.remove("hidden");
          document.querySelector(".sub-title").innerHTML = "Your turn";
        };

        if (cardsImg.gameOver) {
          console.log("you lose");
          document.querySelector("#draw").classList.add("hidden");
          document.querySelector("#hit-me").classList.add("hidden");
          document.querySelector("#play-again").classList.remove("hidden");
          document.querySelector(".sub-title").innerHTML = "Your lose";
        };
      } else {
        document.querySelector(".computer-cards").appendChild(cardTemplate); 
        document.querySelector("#computer-points").innerHTML = `Points: ${cardsImg.points}`
        document.querySelector("#draw").classList.add("hidden");
        document.querySelector("#hit-me").classList.add("hidden");
        document.querySelector("#play-again").classList.add("hidden");
        document.querySelector("#computer-turn").classList.remove("hidden");
        document.querySelector(".sub-title").innerHTML = "Computer turn";

        if (cardsImg.gameOver) {
          document.querySelector("#draw").classList.add("hidden");
          document.querySelector("#hit-me").classList.add("hidden");
          document.querySelector("#computer-turn").classList.add("hidden");
          document.querySelector("#play-again").classList.remove("hidden");
          document.querySelector(".sub-title").innerHTML = "You win";
        } else if(!cardsImg.next) {
          document.querySelector("#draw").classList.add("hidden");
          document.querySelector("#hit-me").classList.add("hidden");
          document.querySelector("#computer-turn").classList.add("hidden");
          document.querySelector("#play-again").classList.remove("hidden");
          document.querySelector(".sub-title").innerHTML = "Computer wins";
        }
      }
      
      

      

    });

  } catch (erro) {
    console.error("Erro na requisição:", erro);
  }
};

window.addEventListener("DOMContentLoaded", () => {
  // Todos os seus eventListeners aqui dentro

  document.querySelector("#draw").addEventListener("click", async () => {
    await getCard("draw", "user");
    document.querySelector("#stand").classList.remove("hidden");
  });

  document.querySelector("#hit-me").addEventListener("click", async () => {
    await getCard("hit-me", "user");
  });

  document.querySelector("#play-again").addEventListener("click", async () => {
    try {
      const answer = await fetch(`/play-again`);
      if (!answer.ok) {
        const errorData = await answer.json();
        alert(errorData.message); 
        return;
      }

      document.querySelector("#draw").classList.remove("hidden");
      document.querySelector("#hit-me").classList.add("hidden");
      document.querySelector("#play-again").classList.add("hidden");
      document.querySelector(".sub-title").innerHTML = "Your turn";
      document.querySelectorAll(".card-container").forEach((card) => card.remove());
      document.querySelector("#user-points").innerHTML = "Points: 0";
      document.querySelector("#computer-points").innerHTML = "Points: 0";
    } catch (erro) {
      console.error("Erro na requisição:", erro);
    }
  });

  document.querySelector("#stand").addEventListener("click", async () => {
    document.querySelector("#stand").classList.add("hidden")
    const computerCards = await getCard("stand", "computer");
  });
});
