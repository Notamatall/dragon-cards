import { Dispatch, memo, SetStateAction, useMemo } from "react";
import PlinkoNumberOfBetsInput from "./number-of-bets/PlinkoNumberOfBetsInput";
import PlinkoBetAmountInput from "./PlinkoBetAmountInput";
import { useDragonCardContext } from "hooks/useDragonCardContext";
import PlinkoRiskSelector from "./risk-selector/PlinkoRiskSelector";

interface AutoBetBarProps {
  isAutobetActive: boolean;
  autobetState: [number, Dispatch<SetStateAction<number>>];
}

const PlinkoAutobetTab: React.FC<AutoBetBarProps> = memo(({ isAutobetActive, autobetState }) => {
  const { bet, localBalance, risk } = useDragonCardContext();
  const canMakeBet = useMemo(() => localBalance.ref.current - bet.value >= 0, [localBalance, bet]);

  return (
    <>
      <PlinkoBetAmountInput isDisabled={isAutobetActive} canMakeBet={canMakeBet} bet={bet} />
      <PlinkoRiskSelector isDisabled={isAutobetActive} risk={risk} />
      <PlinkoNumberOfBetsInput isAutobetActive={isAutobetActive} autobetState={autobetState} />
    </>
  );
});

export default PlinkoAutobetTab;
