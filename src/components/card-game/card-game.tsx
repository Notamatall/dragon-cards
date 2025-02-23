import { useEffect, useRef, useState } from "react";
import fireDragon from "assets/images/fire-dragon.png";
import frostDragon from "assets/images/frost-dragon.png";
import shadowDragon from "assets/images/shadow-dragon.png";
import stormDragon from "assets/images/storm-dragon.png";
import earthDragon from "assets/images/earth-dragon.png";
import backface from "assets/images/backface.png";
import finishGameSoundMp3 from "assets/sounds/magic-revilation.mp3";
import emptyCard from "assets/images/empty-card.png";

import { motion } from "framer-motion";
import "./card-game.css";
// Initial card data (you can customize these values)
const initialCards = [
  { id: 1, value: "A", img: fireDragon },
  { id: 2, value: "B", img: frostDragon },
  { id: 3, value: "C", img: shadowDragon },
  { id: 4, value: "D", img: stormDragon },
  { id: 5, value: "E", img: earthDragon },
  { id: 6, value: "F", img: emptyCard },
];
interface Card {
  id: number;
  value: string;
  img: string;
}

function CardGame() {
  // State for cards, the selected card index, and whether the game is finished.
  const [cards, setCards] = useState(initialCards);
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
  const isGameProcessing = useRef<boolean>(false);
  const [resultCards, setResultCards] = useState<Card[]>([]);
  const [finishGameSound] = useState(new Audio());
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const handleCardClick = (index: number) => {
    if (isPlayingSound) return;
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      const newCards = [...cards];
      [newCards[selectedIndex], newCards[index]] = [
        newCards[index],
        newCards[selectedIndex],
      ];
      setCards(newCards);
      setSelectedIndex(null);
    }
  };
  const waitAsync = (time: number) =>
    new Promise((res) => setTimeout(() => res(null), time));

  const onSoundEnded = async () => {
    setIsPlayingSound(false);
    const resultingArray = [];
    const cardsList = initialCards.slice();
    const cardsCount = cardsList.length;
    for (let index = 0; index < cardsCount; index++) {
      const randomCardIndex = Math.floor(Math.random() * cardsList.length);
      const randomCard = cardsList.splice(randomCardIndex, 1)[0];
      resultingArray.push(randomCard);
      await waitAsync(350);
      setResultCards((prev) => [...prev, randomCard]);
    }

    await waitAsync(700);
    isGameProcessing.current = false;
  };

  useEffect(() => {
    finishGameSound.src = finishGameSoundMp3;
    // const onSoundEnded = async () => {
    //   setIsPlayingSound(false);
    //   setGameFinished(true);

    //   const resultingArray = [];
    //   const cardsList = initialCards.slice();
    //   const cardsCount = cardsList.length;
    //   for (let index = 0; index < cardsCount; index++) {
    //     const randomCardIndex = Math.floor(Math.random() * cardsList.length);
    //     const randomCard = cardsList.splice(randomCardIndex, 1)[0];
    //     resultingArray.push(randomCard);
    //     await waitAsync(350);
    //     setResultCards((prev) => [...prev, randomCard]);
    //   }
    // };
    // finishGameSound.addEventListener("ended", onSoundEnded);

    // return () => {
    //   finishGameSound.removeEventListener("ended", onSoundEnded);
    // };
  }, [finishGameSound]);

  const onFinishGameClick = async () => {
    if (isGameProcessing.current) return;
    isGameProcessing.current = true;

    setIsPlayingSound(true);
    setTimeout(() => {
      setResultCards([]);
    }, 1000);
    await finishGameSound.play();
    setTimeout(() => {
      onSoundEnded();
    }, 1200);
  };

  return (
    <div>
      <h2 className="title">Dragon card</h2>

      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <div
          className="cards-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(50px, 200px))",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {cards.map((card, index) => (
            <div
              style={{
                position: "relative",
                // transform: isPlayingSound ? "scale(0.9)" : "scale(1)",
              }}
              className="card-container"
              data-rotated={
                !isPlayingSound && resultCards[index]?.img ? true : false
              }
              key={`${card.id}`}
            >
              <div className="card-container-inner">
                <div
                  style={{
                    position: "absolute",
                    backfaceVisibility: "hidden",
                  }}
                >
                  <img src={backface} className="card" />
                </div>
                {
                  <div
                    style={{
                      height: "100%",
                      width: "100%",
                      position: "absolute",
                      transform: "rotateY(180deg)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <img
                      className="card"
                      src={resultCards[index]?.img ?? null}
                    />
                  </div>
                }
              </div>
            </div>
          ))}
        </div>

        <div
          className="cards-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(50px, 200px))",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          {cards.map((card, index) => (
            <motion.div layout style={{ position: "relative" }} key={card.id}>
              <motion.img
                layout
                src={card.img}
                className="card"
                onClick={() => handleCardClick(index)}
                data-selected={isPlayingSound ? false : selectedIndex === index}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* {gameFinished ? card.value : "Card Back"} */}
              </motion.img>
            </motion.div>
          ))}
        </div>
      </div>

      <button onClick={onFinishGameClick}>finish games</button>
    </div>
  );
}

export default CardGame;
