import express from "express"
import axios from "axios"

const app = express();
const port = 3000;

let deckId;
let userPoints = 0;
let computerPoints = 0;
let gameOver = false;

app.use(express.static("public"));

function win() {
  if (computerPoints > 21) {
    return true;
  } else {
    return false;
  }
}

function lose() {
  if (userPoints > 21) {
    return true;
  } else if (computerPoints > userPoints && computerPoints < 22) {
    return true;
  } else {
    return false;
  };
};

async function getCard (id, numberOfCards, currentPlayer) {
  const deck = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=${numberOfCards}`);
  if (id === "new") {
    deckId = deck.data.deck_id;
  };

  let drawCards = [];

  let points = 0;
  for (let i = 0; i < numberOfCards; i++) {
    drawCards.push(deck.data.cards[i].image)
    if (deck.data.cards[i].value === "JACK" || deck.data.cards[i].value === "KING" || deck.data.cards[i].value === "QUEEN" ) {
      points += 10;
    } else if (deck.data.cards[i].value === "ACE") {
      points += 1;
    } else {
      points += parseInt(deck.data.cards[i].value);
    }
    
  };

  let handOfCards;

  if (currentPlayer === "user") {
    userPoints += points;
    handOfCards = {
      cards: drawCards,
      points: userPoints,
      gameOver: false
    };
  } else {
    computerPoints += points;
    let nextCard = true;
    let playerWins = false;
    if (lose()) {
      nextCard = false;
    } else if (win()) {
      nextCard = false;
      playerWins = true;
      
    };
    
    handOfCards = {
      cards: drawCards,
      points: computerPoints,
      next: nextCard,
      gameOver: playerWins
    }
  };
  

  return handOfCards;
};

app.get("/draw", async (req, res) => {
  if (!gameOver) {
    res.send(await getCard("new", 2, "user"));
  } else {
     res.status(400).send({
      error: "Game over",
      gameOver: true,
      message: "You can't take more cards because the game is over."
    });
  };
});


app.get("/hit-me", async (req, res) => {
  if (!gameOver) {
    let newCards = await getCard(deckId, 1, "user");
    if (lose()){
      newCards.gameOver = true;
      gameOver = true;
    };
    res.send(newCards);
  } else {
    res.status(400).send({
      error: "Game over",
      gameOver: true,
      message: "You can't take more cards because the game is over."
    });
  };
  
});

app.get("/play-again", async (req, res) => {
  computerPoints = 0;
  userPoints = 0;
  gameOver = false;
  const situation = {
    ok: true
  };
  res.send(situation);
});


app.get("/stand", async (req, res) => {
  let allCards = [];
  let next = true;
  let playerWins = false;

  while (next) {
    const draw = await getCard(deckId, 1, "computer");
    allCards.push(...draw.cards); // acumula as imagens das cartas
    next = draw.next;
    playerWins = draw.gameOver;
  }

  gameOver = true;

  res.send({
    cards: allCards,
    points: computerPoints,
    gameOver: playerWins
  });
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});