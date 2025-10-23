import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import styles from "./PlinkoSideBar.module.scss";
import AutobetTab from "./PlinkoAutobetTab";
import { SideBarTab, SideBarTabs } from "types/dragon-card";
import Button from "../button/Button";
import { ISwitchButton } from "types/switch-buttons";
import PlinkoManualTab from "./PlinkoManualTab";
import useAudioContext from "hooks/useAudioContext";

interface SideBarProps {
  makeBet: () => Promise<boolean>;
  balance: string;
  canMakeBet: boolean;
}

const Sidebar: React.FC<SideBarProps> = ({ makeBet, balance, canMakeBet }): React.ReactElement => {
  const { playSound } = useAudioContext();

  const [activePanel, setActivePanel] = useState<SideBarTabs>(SideBarTab.MANUAL);
  const [autobetCount, setAutobetsCount] = useState<number>(0);
  const [isAutobetActive, setIsAutobetActive] = useState<boolean>(false);
  const autobetTimeout = useRef<number | null>(null);
  const isAutobetRunning = useRef<boolean>(false);

  const stopAutobet = useCallback(() => {
    setIsAutobetActive(false);
    isAutobetRunning.current = false;
    if (autobetTimeout.current) {
      clearInterval(autobetTimeout.current);
    }
  }, []);

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
      makeBet().then(() => {
        playSound("click");
      });
    }
  }, [activePanel, isAutobetActive, stopAutobet, makeBet, playSound]);

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
        {/* <SwitchButtons changeOrderInMobile={true} buttons={switchButtons} /> */}
        {activePanel === SideBarTab.MANUAL && <PlinkoManualTab isAutobetActive={isAutobetActive} />}
        {activePanel === SideBarTab.AUTO && (
          <AutobetTab
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

export default memo(Sidebar);
