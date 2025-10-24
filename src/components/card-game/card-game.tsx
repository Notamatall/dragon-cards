import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { getProviderGamePath, waitAsync } from "utils/index";
import useAudioContext from "hooks/useAudioContext";
import { motion } from "framer-motion";
import "./card-game.css";
import { DragonCardRiskType } from "types/dragon-card";
import { useDragonCardContext } from "hooks/useDragonCardContext";
import { GameInfo } from "../game";

const initialCards: { id: number; value: DragonCardValue; img: string }[] = [
  { id: 1, value: "A", img: getProviderGamePath("cards", "fire.png") },
  { id: 2, value: "B", img: getProviderGamePath("cards", "frost.png") },
  { id: 3, value: "C", img: getProviderGamePath("cards", "shadow.png") },
  { id: 4, value: "D", img: getProviderGamePath("cards", "storm.png") },
  { id: 5, value: "E", img: getProviderGamePath("cards", "earth.png") },
  { id: 6, value: "F", img: getProviderGamePath("cards", "empty.png") },
  { id: 7, value: "S", img: getProviderGamePath("cards", "skeleton.png") },
  { id: 8, value: "S", img: getProviderGamePath("cards", "skeleton.png") },
  { id: 9, value: "S", img: getProviderGamePath("cards", "skeleton.png") },
];

export type DragonCardValue = "A" | "B" | "C" | "D" | "E" | "F" | "S" | "P";

const CardImages: Record<DragonCardValue, string> = {
  A: getProviderGamePath("cards", "fire.png"),
  B: getProviderGamePath("cards", "frost.png"),
  C: getProviderGamePath("cards", "shadow.png"),
  D: getProviderGamePath("cards", "storm.png"),
  E: getProviderGamePath("cards", "earth.png"),
  F: getProviderGamePath("cards", "empty.png"),
  P: getProviderGamePath("cards", "poison.png"),
  S: getProviderGamePath("cards", "skeleton.png"),
};
const servserCards: { id: number; value: DragonCardValue; img: string }[] = [
  { id: 1, value: "A", img: getProviderGamePath("cards", "fire.png") },
  { id: 2, value: "B", img: getProviderGamePath("cards", "frost.png") },
  { id: 3, value: "C", img: getProviderGamePath("cards", "shadow.png") },
  { id: 4, value: "D", img: getProviderGamePath("cards", "storm.png") },
  { id: 5, value: "E", img: getProviderGamePath("cards", "earth.png") },
  { id: 6, value: "F", img: getProviderGamePath("cards", "empty.png") },
  { id: 7, value: "P", img: getProviderGamePath("cards", "poison.png") },
  { id: 8, value: "S", img: getProviderGamePath("cards", "skeleton.png") },
  { id: 9, value: "S", img: getProviderGamePath("cards", "skeleton.png") },
];

const multipliersList: Record<DragonCardRiskType, Record<DragonCardValue, number | "death">> = {
  [DragonCardRiskType.CLASSIC]: {
    A: 3, // Fire — moderate win
    B: 2.5, // Frost — small win
    C: 4, // Shadow — solid hit
    D: 6, // Storm — bigger win
    P: 3, // Storm — bigger win
    E: 5, // Earth — steady win
    F: 0, // Empty — no reward
    S: "death", // Skeleton — lose
  },

  [DragonCardRiskType.LOW]: {
    A: 2,
    B: 1.5,
    C: 2.5,
    D: 3,
    E: 2,
    P: 3, // Storm — bigger win

    F: 0,
    S: "death",
  },

  [DragonCardRiskType.MEDIUM]: {
    A: 5,
    B: 4,
    C: 7,
    D: 10,
    E: 6,
    F: 0,
    P: 3, // Storm — bigger win

    S: "death",
  },

  [DragonCardRiskType.HIGH]: {
    A: 12,
    B: 10,
    C: 18,
    D: 25,
    P: 3, // Storm — bigger win

    E: 20,
    F: 0,
    S: "death",
  },
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
        const isLost = finalMatches.some(card => multipliers[card.value] === "death");
        console.log("islost", isLost, finalMatches);

        if (!isLost) {
          const wonMultiplier = finalMatches.reduce(
            (total, card) => (total += multipliers[card.value] as number),
            0,
          );
          console.log("wonMultiplier", wonMultiplier);

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

  // const getMatchColor = (cardId: number, cardIndex: number) => {
  //   const isIncludes = matches.includes(cardId);

  //   if (isIncludes) {
  //     return multipliers[cardIndex] > 0 ? "#53d859" : "#f03030";
  //   }
  //   return "white";
  // };

  const getMultiplierValue = (value: DragonCardValue) => {
    const isDeath = multipliers[value] === "death";
    if (isDeath) return multipliers[value];
    else return `${multipliers[value]}x`;
  };
  const getCardImage = (value: DragonCardValue) => CardImages[value];

  return (
    <div className="card-game-field">
      <div className="cards-container">
        {servserCards.map((card, index) => (
          <div
            className="card-container"
            data-rotated={!isPlayingSound && resultCards[index]?.img ? true : false}
            key={`${card.id}-server`}
          >
            <div className={"card-container-inner"}>
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
                <div className="multiplier">{getMultiplierValue(card.value)}</div>

                <img className="card" src={getCardImage(card.value)} />
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* 
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
        </div> */}
    </div>
  );
}

export default CardGame;
