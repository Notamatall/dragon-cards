import { Dispatch, memo, SetStateAction, useMemo } from "react";
import PlinkoNumberOfBetsInput from "./number-of-bets/PlinkoNumberOfBetsInput";
import PlinkoBetAmountInput from "./PlinkoBetAmountInput";
import PlinkoRowsRange from "./PlinkoRowsRange";
import { usePlinkoContext } from "hooks/useDragonCardContext";
import PlinkoRiskSelector from "./risk-selector/PlinkoRiskSelector";

interface AutoBetBarProps {
  isAutobetActive: boolean;
  autobetState: [number, Dispatch<SetStateAction<number>>];
}

const PlinkoAutobetTab: React.FC<AutoBetBarProps> = memo(({ isAutobetActive, autobetState }) => {
  const { activeBallsCount } = usePlinkoContext();
  const { bet, localBalance, risk, rowsCount } = usePlinkoContext();
  const canMakeBet = useMemo(() => localBalance.ref.current - bet.value >= 0, [localBalance, bet]);

  return (
    <>
      <PlinkoBetAmountInput isDisabled={isAutobetActive} canMakeBet={canMakeBet} bet={bet} />
      <PlinkoRiskSelector isDisabled={isAutobetActive || activeBallsCount.value > 0} risk={risk} />
      <PlinkoRowsRange
        isDisabled={isAutobetActive || activeBallsCount.value > 0}
        rowsCount={rowsCount}
      />
      <PlinkoNumberOfBetsInput isAutobetActive={isAutobetActive} autobetState={autobetState} />
    </>
  );
});

export default PlinkoAutobetTab;
