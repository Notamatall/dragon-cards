import { useCallback, useEffect, useRef, useState } from "react";

import finishGameSoundMp3 from "assets/sounds/magic-revilation.mp3";
import cardFlipMp3 from "assets/sounds/card-flip.mp3";
import rewardMp3 from "assets/sounds/reward-2.mp3";
import DragonSnakeIcon from "assets/icons/dragon-snake.svg";

import { motion } from "framer-motion";
import "./card-game.css";
import { getProviderGamePath } from "utils/index";
// Initial card data (you can customize these values)
const initialCards = [
  { id: 1, value: "A", img: getProviderGamePath("cards", "fire.png") },
  { id: 2, value: "B", img: getProviderGamePath("cards", "frost.png") },
  { id: 3, value: "C", img: getProviderGamePath("cards", "shadow.png") },
  { id: 4, value: "D", img: getProviderGamePath("cards", "storm.png") },
  { id: 5, value: "E", img: getProviderGamePath("cards", "earth.png") },
  { id: 6, value: "F", img: getProviderGamePath("cards", "empty.png") },
];
const servserCards = [
  { id: 1, value: "A", img: getProviderGamePath("cards", "fire.png") },
  { id: 2, value: "B", img: getProviderGamePath("cards", "frost.png") },
  { id: 3, value: "C", img: getProviderGamePath("cards", "shadow.png") },
  { id: 4, value: "D", img: getProviderGamePath("cards", "storm.png") },
  { id: 5, value: "E", img: getProviderGamePath("cards", "earth.png") },
  { id: 6, value: "F", img: getProviderGamePath("cards", "empty.png") },
];

const backface = getProviderGamePath("cards", "backface.png");
interface Card {
  id: number;
  value: string;
  img: string;
}

function CardGame({ roundId, serverCards }: { roundId?: number; serverCards?: Card[] }) {
  // State for cards, the selected card index, and whether the game is finished.
  const [cards, setCards] = useState(initialCards);
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
  const isGameProcessing = useRef<boolean>(false);
  const [resultCards, setResultCards] = useState<Card[]>([]);
  const [matches, setMatches] = useState<number[]>([]);
  const [finishGameSound] = useState(new Audio());
  const [cardFlipSound] = useState(new Audio());
  const [rewardSound] = useState(new Audio());
  const [isPlayingSound, setIsPlayingSound] = useState(false);

  const handleCardClick = (index: number) => {
    if (isPlayingSound) return;
    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      setMatches([]);
      const newCards = [...cards];
      [newCards[selectedIndex], newCards[index]] = [newCards[index], newCards[selectedIndex]];
      setCards(newCards);
      setSelectedIndex(null);
    }
  };
  const waitAsync = (time: number) => new Promise(res => setTimeout(() => res(null), time));

  const onSoundEnded = useCallback(async () => {
    setIsPlayingSound(false);
    const resultingArray = [];
    // const cardsList = servserCards.slice();
    // const cardsCount = cardsList.length;
    if (serverCards) {
      for (let index = 0; index < serverCards.length; index++) {
        const randomCard = serverCards[index];
        resultingArray.push(randomCard);

        setResultCards(prev => [...prev, randomCard]);
        await cardFlipSound.play();
        await waitAsync(200);
      }

      await waitAsync(300);

      for (let index = 0; index < resultingArray.length; index++) {
        const card = cards[index];
        if (resultingArray[index].id === card.id) {
          setMatches(prev => [...prev, card.id]);
          await rewardSound.play();
          await waitAsync(1200);
        }
      }
      isGameProcessing.current = false;
    }
  }, [cardFlipSound, cards, rewardSound, serverCards]);

  useEffect(() => {
    cardFlipSound.src = cardFlipMp3;
    rewardSound.src = rewardMp3;
    finishGameSound.src = finishGameSoundMp3;
    cardFlipSound.playbackRate = 6;
    rewardSound.playbackRate = 2.5;
  }, [cardFlipSound, finishGameSound, rewardSound]);

  useEffect(() => {
    console.log("executing");

    const onFinishGameClick = async () => {
      if (isGameProcessing.current) return;
      isGameProcessing.current = true;

      setIsPlayingSound(true);
      setTimeout(() => {
        setResultCards([]);
        setMatches([]);
      }, 1000);

      await finishGameSound.play();
      setTimeout(() => {
        onSoundEnded();
      }, 1200);
    };
    if (roundId != undefined) {
      onFinishGameClick();
    }
  }, [roundId]);

  return (
    <div style={{ padding: "40px 20px 0   20px " }}>
      <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
        <div
          className="cards-container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, minmax(50px, 200px))",
            justifyContent: "center",
            gap: "15px",
          }}
        >
          {servserCards.map((card, index) => (
            <div
              style={{
                position: "relative",
              }}
              className="card-container"
              data-rotated={!isPlayingSound && resultCards[index]?.img ? true : false}
              key={`${card.id}-server`}
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
                    <img className="card" src={resultCards[index]?.img ?? null} />
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
            gap: "15px",
          }}
        >
          {cards.map((card, index) => (
            <div
              key={`${card.id}-user`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 20,
              }}
            >
              <motion.div layout style={{ position: "relative" }}>
                <motion.img
                  layout
                  src={card.img}
                  className="card"
                  onClick={() => handleCardClick(index)}
                  data-selected={!isGameProcessing.current && selectedIndex === index}
                  data-selectable={!isGameProcessing.current && selectedIndex !== index}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                ></motion.img>
              </motion.div>
              <div
                className="icon-container"
                style={{
                  background: matches.includes(card.id) ? "green" : "red",
                }}
              >
                <img
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  src={DragonSnakeIcon as any}
                  width={50}
                  height={50}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardGame;
