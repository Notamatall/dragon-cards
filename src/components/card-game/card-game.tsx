import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getProviderGamePath, waitAsync } from "utils/index";
import useAudioContext from "hooks/useAudioContext";
import { motion } from "framer-motion";
import "./card-game.css";
import { DragonCardRiskType } from "types/dragon-card";
import { useDragonCardContext } from "hooks/useDragonCardContext";
import { GameInfo } from "../game";

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

const multipliersList = {
  [DragonCardRiskType.CLASSIC]: [0, 3.5, 4, 0, 10, 7],
  [DragonCardRiskType.LOW]: [0, 1, 2, 1, 2.5, 1.5],
  [DragonCardRiskType.MEDIUM]: [0, 3, 5, 0, 6, 1.5],
  [DragonCardRiskType.HIGH]: [0, 0, 25, 0, 50, 0],
};

const getMultipliersByRisk = (risk: DragonCardRiskType) => {
  return multipliersList[risk];
};

const backface = getProviderGamePath("cards", "backface.png");
interface Card {
  id: number;
  value: string;
  img: string;
}

function CardGame({
  lr,
  setLr,
}: {
  lr: GameInfo | undefined;
  setLr: React.Dispatch<React.SetStateAction<GameInfo | undefined>>;
}) {
  const { playSound } = useAudioContext();
  const [cards, setCards] = useState(initialCards);
  const isGameProcessing = useRef<boolean>(false);
  const [matches, setMatches] = useState<number[]>([]);

  const [resultCards, setResultCards] = useState<Card[]>([]);
  const [isPlayingSound, setIsPlayingSound] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<null | number>(null);
  const { risk, localBalance, bet } = useDragonCardContext();

  const multipliers = useMemo(() => {
    return getMultipliersByRisk(risk.value);
  }, [risk]);

  useEffect(() => {
    setMatches([]);
  }, [risk]);

  const handleCardClick = (index: number) => {
    if (isPlayingSound) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      const newCards = [...cards];
      [newCards[selectedIndex], newCards[index]] = [newCards[index], newCards[selectedIndex]];
      setCards(newCards);
      setSelectedIndex(null);
    }
  };

  const onSoundEnded = useCallback(
    async (lr: GameInfo | undefined) => {
      const resultingArray = [];
      setIsPlayingSound(false);

      if (lr?.serverCards) {
        for (let index = 0; index < lr.serverCards.length; index++) {
          const randomCard = lr.serverCards[index];
          resultingArray.push(randomCard);
          setResultCards(prev => [...prev, randomCard]);
          playSound("cardFlip");
          await waitAsync(200);
        }

        await waitAsync(300);

        const finalMatches = [];
        for (let index = 0; index < resultingArray.length; index++) {
          const card = cards[index];
          if (resultingArray[index].id === card.id) {
            finalMatches.push(card);
            setMatches(prev => [...prev, card.id]);
            playSound("reward");

            await waitAsync(400);
          }
        }
        const isLost = finalMatches.some(card => multipliers[card.id - 1] === 0);
        if (!isLost) {
          const wonMultiplier = finalMatches.reduce(
            (total, currCard) => (total += multipliers[currCard.id - 1]),
            0,
          );
          localBalance.addToBalance(bet.value * wonMultiplier);
        }
        setLr(undefined);
        isGameProcessing.current = false;
      }
    },
    [bet.value, cards, localBalance, multipliers, playSound, setLr],
  );

  useEffect(() => {
    const onFinishGameClick = async (lr: GameInfo) => {
      if (isGameProcessing.current) return;
      isGameProcessing.current = true;
      setIsPlayingSound(true);

      setTimeout(() => {
        setResultCards([]);
        setMatches([]);
        console.log("finished");
      }, 1000);

      playSound("reveal");
      setTimeout(() => {
        onSoundEnded(lr);
      }, 1200);
    };
    if (lr) {
      onFinishGameClick(lr);
    }
  }, [onSoundEnded, playSound, lr]);

  const getMatchColor = (cardId: number, cardIndex: number) => {
    const isIncludes = matches.includes(cardId);

    if (isIncludes) {
      return multipliers[cardIndex] > 0 ? "#53d859" : "#f03030";
    }
    return "white";
  };

  return (
    <div className="card-game-field">
      <div className="cards-containers">
        <div className="cards-container">
          {servserCards.map((card, index) => (
            <div
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
              </div>
            </div>
          ))}
        </div>

        <div className="cards-container">
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
                />
              </motion.div>
              <div
                style={{
                  color: getMatchColor(card.id, index),
                }}
                className="icon-container"
              >
                {multipliers[index] == 0 ? "LOST" : `${multipliers[index]}x`}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CardGame;
