// import styles from "./styles.module.scss";
// import { PlinkoBetInfo, PlinkoRows } from "types/plinko";
// import { memo, useCallback, useEffect, useMemo, useState } from "react";
// import { PlinkoMultiplier } from "types/plinko/elements";
// import Accordion from "../accordion";
// import { ISwitchButton } from "types/switch-buttons";
// import {
//   GenericState,
//   ProvablyFairPanel,
//   ProvablyFairPanelType,
//   ProveFairnessResult,
//   RoundReplayInfo,
// } from "types/index";
// import SwitchButtons from "../switch-buttons";
// import SeedsTab from "../seeds-tab/SeedsTab";
// import VerifyTab from "../verify-tab/VerifyTab";
// import Button from "../button/Button";
// import { getProviderGamePath } from "utils/index";

// const PlinkoInfoModal: React.FC<{
//   data: PlinkoBetInfo;
//   onClose: () => void;
// }> = ({ data, onClose }) => {
//   const { authInfo, connector } = useSlotifyContext();
//   const [activePfPanel, setActivePfPanel] = useState<ProvablyFairPanelType>(
//     ProvablyFairPanel.SEEDS,
//   );
//   const [readonlyPFState, setReadonlyPFState] = useState<ProvablyFairRoundState>();
//   const [pfState, setPFState] = useState<RoundReplayInfo>(new RoundReplayInfo());

//   const [proveFairnessValue, setProveFairness] = useState<ProveFairnessResult | null>(null);

//   const proveFainess = useMemo<GenericState<ProveFairnessResult | null>>(() => {
//     return {
//       value: proveFairnessValue,
//       setValue: setProveFairness,
//     };
//   }, [proveFairnessValue]);

//   const refetchRngState = useCallback(async () => {
//     const rngState = await connector.roundRngState(data.roundId);
//     setReadonlyPFState(rngState);
//   }, [connector, data.roundId]);

//   const onVerifyClick = useCallback(() => {
//     setActivePfPanel(ProvablyFairPanel.VERIFICATION);
//     if (readonlyPFState && readonlyPFState.serverSeed) {
//       setPFState({
//         clientSeed: readonlyPFState.clientSeed,
//         serverSeed: readonlyPFState.serverSeed,
//         nonce: readonlyPFState.nonce,
//         rowsCount: data.rowsCount,
//         risk: data.risk,
//       });
//     }
//   }, [data.risk, data.rowsCount, readonlyPFState]);

//   useEffect(() => {
//     document.body.style.overflow = "hidden";

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, []);

//   useEffect(() => {
//     refetchRngState();
//   }, [refetchRngState]);

//   const switchButtons = useMemo<ISwitchButton[]>(() => {
//     return [
//       {
//         label: ProvablyFairPanel.SEEDS,
//         onClick: () => setActivePfPanel(ProvablyFairPanel.SEEDS),
//         isActive: activePfPanel === ProvablyFairPanel.SEEDS,
//       },

//       {
//         label: ProvablyFairPanel.VERIFICATION,
//         onClick: () => setActivePfPanel(ProvablyFairPanel.VERIFICATION),
//         isActive: activePfPanel === ProvablyFairPanel.VERIFICATION,
//       },
//     ];
//   }, [activePfPanel]);

//   if (!readonlyPFState) return null;

//   return (
//     <div className={styles.modalRoot}>
//       <div className={styles.modalOverlay} />
//       <div className={styles.modalInner}>
//         <div className={styles.modalUpperContent}>
//           <div className={styles.modalContent}>
//             <button className={styles.modalCloseButton} onClick={onClose}>
//               <img src={getProviderGamePath("images", "close-icon.svg")} />
//             </button>
//             <div className={styles.infoContainer}>
//               <div className={styles.infoGameTitle}>Plinko</div>
//               <div className={styles.infoHeader}>
//                 Placed by:
//                 <div className={styles.infoHeaderLogin}>
//                   <span className={styles.infoHeaderLoginText}>{authInfo.nickname}</span>
//                 </div>
//               </div>
//               <div className={styles.betInfo}>
//                 <div className={styles.infoBody}>
//                   <div className={styles.infoBodyHeader}>
//                     <div className={styles.infoBodyHeaderCell}>
//                       <span>Bet</span>
//                       <div className={styles.centeredFlex}>
//                         <span>{data.bet.toFixed(authInfo.currencyDecimals)}</span>
//                       </div>
//                     </div>
//                     <div className={styles.infoBodyHeaderCell}>
//                       <span>Multiplier</span>
//                       <div className={styles.centeredFlex}>
//                         <span>
//                           <img
//                             alt="cup"
//                             src={getProviderGamePath("images", "cup.svg")}
//                             width={20}
//                             height={20}
//                           />
//                         </span>
//                         <span>{data.multiplier}x</span>
//                       </div>
//                     </div>
//                     <div className={styles.infoBodyHeaderCell}>
//                       <span>Payout</span>

//                       <div className={styles.centeredFlex}>
//                         <span>{data.payout.toFixed(authInfo.currencyDecimals)}</span>
//                       </div>
//                     </div>
//                   </div>
//                   <div className={styles.infoBodyMultiplier}>
//                     <PlinkoMultiplier
//                       style={{ maxWidth: "55px" }}
//                       $frequency={data.frequency}
//                       $isanimationactive={"false"}
//                       data-adaptive="false"
//                     >
//                       <span>{data.multiplier}</span>
//                       <span>x</span>
//                     </PlinkoMultiplier>
//                   </div>
//                 </div>
//                 <div className="inputsContainer">
//                   <div className="inputContainer" data-size="full">
//                     <div className="inputLabel">Risk</div>
//                     <div className="inputWrapper" data-style="xl" data-color="grey">
//                       <input value={data.risk} readOnly={true} />
//                     </div>
//                   </div>

//                   <div className="inputContainer" data-size="full">
//                     <div className="inputLabel">Rows count</div>
//                     <div className="inputWrapper" data-style="xl" data-color="grey">
//                       <input value={data.rowsCount} readOnly={true} />
//                     </div>
//                   </div>
//                 </div>

//                 <Button attributes={{ onClick: onClose }} size="lg" label="Play Plinko" />
//               </div>
//               <Accordion>
//                 <SwitchButtons buttons={switchButtons} />
//                 {activePfPanel === ProvablyFairPanel.SEEDS && (
//                   <SeedsTab
//                     roundRngState={readonlyPFState}
//                     refetchRngState={refetchRngState}
//                     onVerifyClick={onVerifyClick}
//                   />
//                 )}
//                 {activePfPanel === ProvablyFairPanel.VERIFICATION && (
//                   <VerifyTab
//                     proveFairnessState={proveFainess}
//                     roundReplayInfo={pfState}
//                     updateReplayInfo={setPFState}
//                   />
//                 )}
//               </Accordion>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default memo(PlinkoInfoModal);
