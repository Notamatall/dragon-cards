import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CANVAS_SIZES,
  DEFAULT_MULTIPLIER_WIDTH_PX,
  DEFAULT_PEG_GAP_PX,
  getSizes,
  MIN_PINS_ON_ROW,
} from "types/dragon-card/constants";
import { PlinkoBetInfo, Position } from "types/dragon-card";
import Peg from "types/plinko/peg";
import Ball from "types/plinko/ball";
import { MULTIPLIERS, MULTIPLIERS_FREQUENCIES } from "types/dragon-card/constants";

import { randomInteger } from "utils/index";
import { PlinkoMultipliersContainer, PlinkoResultMultiplier } from "types/plinko/elements";
import usePlinkoAudioContext from "hooks/useAudioContext";
import { usePlinkoContext } from "hooks/useDragonCardContext";
import PlinkoSideBar from "../sidebar";
import SoundController from "../sound-controller";
import styles from "./styles.module.scss";
import { useResourcesContext } from "hooks/useResourcesContext";
import PlinkoMultiplierWithPopover from "../multiplier-with-popover";
import { gameInfo } from "src/constants/game-info";
import plinkoApiService, { PlinkoGameResult } from "src/api/plinkoService";

const PlinkoGame = () => {
  const { animations, plinkoImages } = useResourcesContext();
  const { rowsCount, risk, animationsQueue, activeBallsCount, bet, engine, localBalance } =
    usePlinkoContext();
  const { playMultiplierSound } = usePlinkoAudioContext();
  const [multipliersWidth, setMultipliersWidth] = useState<number>(DEFAULT_MULTIPLIER_WIDTH_PX);
  const getSize = useMemo(() => getSizes(rowsCount.value), [rowsCount]);
  const renderFrameId = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [resultsQueue, setResultsQueue] = useState<PlinkoBetInfo[]>([]);
  const canMakeBet = localBalance.ref.current - bet.value >= 0;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx && canvas) {
      canvas.height = CANVAS_SIZES.height;
      canvas.width = CANVAS_SIZES.width;
      engine.launchEngine(canvas, ctx, renderFrameId);
    }

    const renderFrameIdLocal = renderFrameId;

    return () => {
      if (renderFrameIdLocal.current) {
        cancelAnimationFrame(renderFrameIdLocal.current);
      }
    };
  }, [renderFrameId, engine]);

  useEffect(() => {
    engine.clearPegs();

    const { spacing, pegRadius } = getSize;

    for (let row = 0; row < engine.rowsCount; row++) {
      const start = CANVAS_SIZES.width / 2 - ((row + MIN_PINS_ON_ROW - 1) / 2) * spacing;
      for (let column = 0; column < row + MIN_PINS_ON_ROW; column++) {
        const x = start + spacing * column;
        const y = DEFAULT_PEG_GAP_PX + pegRadius + row * spacing;
        engine.addPeg(
          new Peg(x, y, pegRadius, plinkoImages.sparksImage, plinkoImages.collidingPegImage),
        );
      }
    }

    if (canvasRef.current) {
      const multiplierWidth =
        (spacing * (rowsCount.value + 1) * canvasRef.current.offsetWidth) / CANVAS_SIZES.width;
      setMultipliersWidth(multiplierWidth);
    }
  }, [engine, getSize, plinkoImages, rowsCount]);

  useEffect(() => {
    const onResizeAction = () => {
      if (canvasRef.current) {
        const { spacing } = getSize;
        const multiplierWidth =
          (spacing * (rowsCount.value + 1) * canvasRef.current.offsetWidth) / CANVAS_SIZES.width;
        setMultipliersWidth(multiplierWidth);
      }
    };

    window.addEventListener("resize", onResizeAction);
    return () => {
      window.removeEventListener("resize", onResizeAction);
    };
  }, [getSize, rowsCount]);

  const createBall = useCallback(
    (index: number, animation: Position[], bet: number, model: PlinkoGameResult) => {
      const { rowsCount, payout, multiplier, risk, roundId } = model;
      const { ballRadius } = getSize;
      const y = 0;
      const x = animation[0].x;
      const ball = new Ball(
        x,
        y,
        ballRadius,
        async () => {
          const result: PlinkoBetInfo = {
            frequency: MULTIPLIERS_FREQUENCIES[rowsCount][index],
            payout,
            multiplier,
            rowsCount,
            risk,
            bet,
            roundId: roundId.toString(),
          };

          activeBallsCount.setValue(prev => prev - 1);
          setResultsQueue(prev => [result, ...prev.slice(0, 5)]);
          animationsQueue.setValue(prev => [...prev, index]);
          localBalance.addToBalance(model.payout);

          setTimeout(() => {
            animationsQueue.setValue(prev => prev.filter(v => v !== index));
          }, 200);

          playMultiplierSound();
        },
        index,
        plinkoImages.ballImage,
        animation,
      );
      return ball;
    },
    [
      getSize,
      plinkoImages.ballImage,
      activeBallsCount,
      animationsQueue,
      localBalance,
      playMultiplierSound,
    ],
  );

  const validateBetSize = useCallback((bet: number) => {
    if (bet < gameInfo.minBet) {
      return false;
    }
    if (bet > gameInfo.maxBet) {
      return false;
    }
    return true;
  }, []);

  const handleDropBall = useCallback(async () => {
    if (!validateBetSize(bet.value)) return false;
    const prevBalance = localBalance.ref.current;
    const balanceAfterBet = localBalance.ref.current - bet.value;
    if (balanceAfterBet >= 0) {
      localBalance.ref.current = localBalance.ref.current - bet.value;

      try {
        activeBallsCount.setValue(prev => prev + 1);

        const response = await plinkoApiService.getResult(bet.value, rowsCount.value, risk.value);
        if (response) {
          const { multiplierIndex } = response;
          const multiplierAnimations = animations[rowsCount.value][multiplierIndex];
          const randomAnimationIndex = randomInteger(0, multiplierAnimations.length);
          const animation = multiplierAnimations[randomAnimationIndex];
          const newBall = createBall(multiplierIndex, animation, bet.value, response);

          localBalance.setValue(localBalance.ref.current);
          engine.addBall(newBall);
          return true;
        } else {
          activeBallsCount.setValue(prev => prev - 1);
        }
      } catch (error: any) {
        console.error(error);
        localBalance.ref.current = prevBalance;
        activeBallsCount.setValue(prev => prev - 1);
        return false;
      }
    }
    return false;
  }, [
    validateBetSize,
    bet.value,
    localBalance,
    activeBallsCount,
    rowsCount.value,
    risk.value,
    animations,
    createBall,
    engine,
  ]);

  const [modalInfo, setModalnfo] = useState<{ info: PlinkoBetInfo; isOpen: boolean }>({
    info: {} as PlinkoBetInfo,
    isOpen: false,
  });

  const PlinkoResults = useMemo(
    () =>
      resultsQueue
        .slice(resultsQueue.length >= 6 ? resultsQueue.length - 6 : 0, resultsQueue.length)
        .map((result, index) => (
          <PlinkoResultMultiplier
            onClick={() => setModalnfo({ isOpen: true, info: result })}
            $frequency={result.frequency}
            key={`multiplier_result-${index}-${result.roundId}`}
          >
            <span>{result.multiplier}</span>
            <span>x</span>
          </PlinkoResultMultiplier>
        )),
    [resultsQueue],
  );

  const PlinkoMultipliers = useMemo(() => {
    const multipliers = MULTIPLIERS[rowsCount.value][risk.value];
    const frequencies = MULTIPLIERS_FREQUENCIES[rowsCount.value];
    return (
      <PlinkoMultipliersContainer style={{ width: `${multipliersWidth}px` }}>
        {multipliers.map((multiplier, index) => (
          <PlinkoMultiplierWithPopover
            key={`multiplier-${index}`}
            bet={bet.value}
            rowsCount={rowsCount.value}
            multiplier={multiplier}
            index={index}
            frequency={frequencies[index]}
            isAnimationActive={animationsQueue.value.includes(index)}
          />
        ))}
      </PlinkoMultipliersContainer>
    );
  }, [rowsCount.value, risk.value, multipliersWidth, bet.value, animationsQueue.value]);

  return (
    <div className={styles.plinkoWrapper}>
      {/* {modalInfo.isOpen && (
        <ProvablyFairPopup
          data={modalInfo.info}
          onClose={() => setModalnfo(prev => ({ ...prev, isOpen: false }))}
        />
      )} */}

      <div className="plinkoBalanceContainer" data-mobile={true}>
        <span>Balance:</span>
        <span>{localBalance.value}</span>
      </div>
      <div className={styles.plinkoGameContainer}>
        <div className={styles.plinkoSidebar}>
          <PlinkoSideBar
            dropBall={handleDropBall}
            balance={localBalance.value}
            canMakeBet={canMakeBet}
          />
        </div>

        <div className={styles.plinkoBoard}>
          <div className={styles.plinkoAbsoluteWrapper}>
            <SoundController />
          </div>
          <div className={styles.plinkoCanvasContainer}>
            <canvas ref={canvasRef}></canvas>
          </div>
          {PlinkoMultipliers}

          <div className={styles.plinkoGameResults}>{PlinkoResults}</div>
        </div>
      </div>
    </div>
  );
};

export default PlinkoGame;
