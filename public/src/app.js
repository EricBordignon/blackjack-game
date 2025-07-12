document.querySelector("#draw").addEventListener("click", async () => {
  try {
    const answer = await fetch("/draw");
    if (!answer.ok) {
      throw new Error("Error to draw card");
      console.log("error");
    }

    const cardsImg = await answer.json(); // Aqui vem o objeto com os dados da carta
    console.log("Cards received:", cardsImg);

    // DOM manipulation here
    cardsImg.cards.forEach(card => {
      const cardTemplate = document.createElement("div");
      console.log(card);
      cardTemplate.innerHTML = `
        <img src="${card}" alt="card" class="card" onerror="console.log('Erro ao carregar imagem')">
      `;
      document.querySelector(".user-cards").appendChild(cardTemplate); 

      document.querySelector("#draw").classList.add("hidden")
      document.querySelector("#hit-me").classList.remove("hidden")
      
    });
  
    

  } catch (erro) {
    console.error("Erro na requisição:", erro);
  }
});

document.querySelector("#hit-me").addEventListener("click", async () => {
  try {
    const answer = await fetch("/hit-me");
    if (!answer.ok) {
      throw new Error("Error to draw card");
      console.log("error");
    }

    const cardsImg = await answer.json(); // Aqui vem o objeto com os dados da carta
    console.log("Cards received:", cardsImg);

    // DOM manipulation here
    cardsImg.cards.forEach(card => {
      const cardTemplate = document.createElement("div");
      console.log(card);
      cardTemplate.innerHTML = `
        <img src="${card}" alt="card" class="card" onerror="console.log('Erro ao carregar imagem')">
      `;
      document.querySelector(".user-cards").appendChild(cardTemplate); 
    });
  
    

  } catch (erro) {
    console.error("Erro na requisição:", erro);
  }
});
