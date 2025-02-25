import { memo, useEffect, useMemo, useRef, useState } from "react";
import { Frequency, PlinkoRows } from "types/dragon-card";
import { PlinkoMultiplier } from "types/plinko/elements";
import styles from "./styles.module.scss";
import { ArrowContainer, Popover } from "react-tiny-popover";
import CustomInput from "../custom-input/CustomInput";
import { calculateProbability, calculateReward } from "utils/index";

interface SinglePlinkoMultiplier {
  multiplier: number;
  frequency: Frequency;
  isAnimationActive: boolean;
  bet: number;
  index: number;
  rowsCount: PlinkoRows;
}

const PlinkoMultiplierWithPopover = ({
  multiplier,
  frequency,
  isAnimationActive,
  bet,
  rowsCount,
  index,
}: SinglePlinkoMultiplier) => {
  const [isPopoverVisible, setIsPopoverVisible] = useState<boolean>(false);
  const multiplierRef = useRef<HTMLDivElement>(null);

  const toggleVisibility = () => {
    setIsPopoverVisible(prev => !prev);
  };

  useEffect(() => {
    const multiplierContainer = multiplierRef.current;
    if (multiplierContainer) {
      multiplierContainer.addEventListener("mouseenter", toggleVisibility);
      multiplierContainer.addEventListener("mouseleave", toggleVisibility);
    }
    return () => {
      if (multiplierContainer) {
        multiplierContainer.removeEventListener("mouseenter", toggleVisibility);
        multiplierContainer.removeEventListener("mouseleave", toggleVisibility);
      }
    };
  }, []);

  const reward = useMemo(() => {
    return calculateReward(bet, multiplier);
  }, [bet, multiplier]);

  const probability = useMemo(() => {
    return calculateProbability(rowsCount, index);
  }, [rowsCount, index]);

  return (
    <Popover
      isOpen={isPopoverVisible}
      positions={["top", "right", "left", "bottom"]}
      padding={20}
      ref={multiplierRef}
      content={({ position, childRect, popoverRect }) => (
        <ArrowContainer
          position={position}
          childRect={childRect}
          popoverRect={popoverRect}
          arrowColor={"#025cc175"}
          arrowSize={11}
          className={styles.popoverContainer}
          arrowClassName={styles.popoverArrow}
        >
          <div className={styles.popoverContentContainer}>
            <CustomInput
              label="Profit"
              value={reward}
              color="#1F273A"
              props={{ readOnly: true, id: "profit-input" }}
            />
            <CustomInput
              label="Chance"
              value={probability}
              color="#1F273A"
              props={{ readOnly: true, id: "chance-input" }}
            />
          </div>
        </ArrowContainer>
      )}
    >
      <PlinkoMultiplier
        data-adaptive="true"
        $isanimationactive={isAnimationActive.toString()}
        $frequency={frequency}
      >
        <span>{multiplier}</span>
      </PlinkoMultiplier>
    </Popover>
  );
};
export default memo(PlinkoMultiplierWithPopover);
