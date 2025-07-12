import express from "express"
import axios from "axios"

const app = express();
const port = 3000;

let deckId;

app.use(express.static("public"));

async function getCard (id, numberOfCards) {
  const deck = await axios.get(`https://deckofcardsapi.com/api/deck/${id}/draw/?count=${numberOfCards}`);
  if (id === "new") {
    deckId = deck.data.deck_id;
  };

  let drawCards = [];
  for (let i = 0; i < numberOfCards; i++) {
    drawCards.push(deck.data.cards[i].image)
  };

  const handOfCards = {
    cards: drawCards
  };

  return handOfCards;
};

app.get("/draw", async (req, res) => {
  res.send(await getCard("new", 2));
});


app.get("/hit-me", async (req, res) => {
  res.send(await getCard(deckId, 1));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});