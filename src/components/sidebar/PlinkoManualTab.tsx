import { usePlinkoContext } from "hooks/useDragonCardContext";
import PlinkoBetAmountInput from "./PlinkoBetAmountInput";
import PlinkoRowsRange from "./PlinkoRowsRange";
import { memo, useMemo } from "react";
import PlinkoRiskSelector from "./risk-selector/PlinkoRiskSelector";

interface PlinkoManualBarProps {
  isAutobetActive: boolean;
}

const PlinkoManualTab: React.FC<PlinkoManualBarProps> = memo(({ isAutobetActive }) => {
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
    </>
  );
});

export default PlinkoManualTab;
