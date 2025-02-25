import PlinkoBetAmountInput from "./PlinkoBetAmountInput";
import { memo, useMemo } from "react";
import PlinkoRiskSelector from "./risk-selector/PlinkoRiskSelector";
import { useDragonCardContext } from "hooks/useDragonCardContext";

interface PlinkoManualBarProps {
  isAutobetActive: boolean;
}

const PlinkoManualTab: React.FC<PlinkoManualBarProps> = memo(({ isAutobetActive }) => {
  const { bet, localBalance, risk } = useDragonCardContext();
  const canMakeBet = useMemo(() => localBalance.ref.current - bet.value >= 0, [localBalance, bet]);

  return (
    <>
      <PlinkoBetAmountInput isDisabled={isAutobetActive} canMakeBet={canMakeBet} bet={bet} />
      <PlinkoRiskSelector isDisabled={isAutobetActive} risk={risk} />
    </>
  );
});

export default PlinkoManualTab;
