import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "./PlinkoSideBar.module.scss";
import PlinkoAutobetTab from "./PlinkoAutobetTab";
import PlinkoManualTab from "./PlinkoManualTab";
import { SideBarTab, SideBarTabs } from "types/dragon-card";
import usePlinkoAudioContext from "hooks/useAudioContext";
import Button from "../button/Button";
import { ISwitchButton } from "types/switch-buttons";
import SwitchButtons from "../switch-buttons";

interface PlinkoSideBarProps {
  dropBall: () => Promise<boolean>;
  balance: string;
  canMakeBet: boolean;
}

const PlinkoSideBar: React.FC<PlinkoSideBarProps> = ({
  dropBall,
  balance,
  canMakeBet,
}): React.ReactElement => {
  const { playDropSound } = usePlinkoAudioContext();
  const [activePanel, setActivePanel] = useState<SideBarTabs>(SideBarTab.MANUAL);
  const [autobetCount, setAutobetsCount] = useState<number>(0);
  const [isAutobetActive, setIsAutobetActive] = useState<boolean>(false);
  const autobetTimeout = useRef<any | null>(null);
  const isAutobetRunning = useRef<boolean>(false);

  const stopAutobet = useCallback(() => {
    setIsAutobetActive(false);
    isAutobetRunning.current = false;
    if (autobetTimeout.current) {
      clearInterval(autobetTimeout.current);
    }
  }, []);

  useEffect(() => {
    if (isAutobetActive === true && isAutobetRunning.current === false) {
      const runAutobet = async (remainingBets: number) => {
        const plinkoResult = await dropBall();
        if (plinkoResult) {
          playDropSound();
        }

        if (remainingBets !== Infinity) {
          remainingBets--;
          setAutobetsCount(prev => prev - 1);
        }

        if (!plinkoResult || remainingBets <= 0 || isAutobetRunning.current === false) {
          stopAutobet();
          return;
        }

        autobetTimeout.current = setTimeout(async () => {
          runAutobet(remainingBets);
        }, 300);
      };

      isAutobetRunning.current = true;
      const betsCount = autobetCount || Infinity;

      runAutobet(betsCount);
    }
  }, [isAutobetActive, autobetCount, dropBall, stopAutobet, playDropSound]);

  useEffect(() => {
    return () => {
      stopAutobet();
    };
  }, [stopAutobet]);

  const onStartAutobetClick = () => {
    setIsAutobetActive(true);
  };

  const getBetButtonLabel = useMemo(() => {
    switch (activePanel) {
      case SideBarTab.AUTO: {
        return isAutobetActive ? "Stop Autobet" : "Start Autobet";
      }
      case SideBarTab.MANUAL: {
        return "Place Bet";
      }
      default:
        return "";
    }
  }, [activePanel, isAutobetActive]);

  const onBtnClick = useCallback(() => {
    if (activePanel === SideBarTab.AUTO) {
      if (isAutobetActive) {
        stopAutobet();
      } else {
        onStartAutobetClick();
      }
    } else {
      dropBall().then(isDropped => {
        if (isDropped) {
          playDropSound();
        }
      });
    }
  }, [activePanel, dropBall, isAutobetActive, playDropSound, stopAutobet]);

  const switchButtons = useMemo<ISwitchButton[]>(() => {
    return [
      {
        label: SideBarTab.MANUAL,
        onClick: () => setActivePanel(SideBarTab.MANUAL),
        isActive: activePanel === SideBarTab.MANUAL,
        disabled: isAutobetActive,
      },

      {
        label: SideBarTab.AUTO,
        onClick: () => setActivePanel(SideBarTab.AUTO),
        isActive: activePanel === SideBarTab.AUTO,
        disabled: isAutobetActive,
      },
    ];
  }, [activePanel, isAutobetActive]);

  return (
    <>
      <div className={styles.plinkoActions}>
        <SwitchButtons changeOrderInMobile={true} buttons={switchButtons} />
        {activePanel === SideBarTab.MANUAL && <PlinkoManualTab isAutobetActive={isAutobetActive} />}
        {activePanel === SideBarTab.AUTO && (
          <PlinkoAutobetTab
            isAutobetActive={isAutobetActive}
            autobetState={[autobetCount, setAutobetsCount]}
          />
        )}
        <Button
          label={getBetButtonLabel}
          attributes={{ onClick: onBtnClick, disabled: !canMakeBet }}
          adaptiveOrder={true}
        />
        <div className="plinkoBalanceContainer" data-mobile={false}>
          <span>Balance:</span>
          <span>{balance}</span>
        </div>
      </div>
    </>
  );
};

export default memo(PlinkoSideBar);
