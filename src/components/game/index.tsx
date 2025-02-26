import { useCallback, useState } from "react";

import Sidebar from "../sidebar";
import SoundController from "../sound-controller";
import styles from "./styles.module.scss";
import { useDragonCardContext } from "hooks/useDragonCardContext";
import { gameInfo } from "src/constants/game-info";
import apiService, { Card } from "src/api/plinkoService";
import CardGame from "../card-game/card-game";

const Game = () => {
  const { risk, bet, localBalance } = useDragonCardContext();
  const canMakeBet = localBalance.ref.current - bet.value >= 0;
  const [lastResponse, setlr] = useState<{ serverCards: Card[]; roundId: number }>();
  // const [modalInfo, setModalnfo] = useState<{ info: PlinkoBetInfo; isOpen: boolean }>({
  //   info: {} as PlinkoBetInfo,
  //   isOpen: false,
  // });

  const validateBetSize = useCallback((bet: number) => {
    if (bet < gameInfo.minBet) {
      return false;
    }
    if (bet > gameInfo.maxBet) {
      return false;
    }
    return true;
  }, []);

  const makeBet = async () => {
    if (!validateBetSize(bet.value)) return false;
    const prevBalance = localBalance.ref.current;
    const balanceAfterBet = localBalance.ref.current - bet.value;
    if (balanceAfterBet >= 0) {
      localBalance.ref.current = localBalance.ref.current - bet.value;

      try {
        const response = await apiService.getResult();
        console.log(response);
        setlr(response);
        // if (response) {
        //   const { multiplierIndex } = response;

        //   localBalance.setValue(localBalance.ref.current);
        //   return true;
        // } else {
        //   activeBallsCount.setValue(prev => prev - 1);
        // }
      } catch (error: unknown) {
        console.error(error);
        localBalance.ref.current = prevBalance;
        // activeBallsCount.setValue(prev => prev - 1);
        return false;
      }
    }
    return false;
  };
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
          <Sidebar makeBet={makeBet} balance={localBalance.value} canMakeBet={canMakeBet} />
        </div>

        <div className={styles.plinkoBoard}>
          <div className={styles.plinkoAbsoluteWrapper}>
            <SoundController />
          </div>
          <div className={styles.plinkoCanvasContainer}>
            <CardGame serverCards={lastResponse?.serverCards} roundId={lastResponse?.roundId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Game;
