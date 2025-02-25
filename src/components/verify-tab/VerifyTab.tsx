// import { useCallback, useState } from "react";
// import { GenericState, ProveFairnessResult, RoundReplayInfo } from "types/index";
// import Button from "../button/Button";
// import ComboBox from "../combo-box/Combobox";
// import { Frequency, plinkoRowsList } from "types/plinko";
// import { MULTIPLIERS, MULTIPLIERS_FREQUENCIES, RISK_LIST } from "types/plinko/constants";
// import { PlinkoMultiplier } from "types/plinko/elements";
// import styles from "./styles.module.scss";
// import CopyButton from "../copy-button/CopyButton";

// interface VerifyTabProps {
//   proveFairnessState: GenericState<ProveFairnessResult | null>;
//   roundReplayInfo: RoundReplayInfo;
//   updateReplayInfo: React.Dispatch<React.SetStateAction<RoundReplayInfo>>;
// }

// const VerifyTab = ({ roundReplayInfo, updateReplayInfo, proveFairnessState }: VerifyTabProps) => {
//   const { serverSeed, clientSeed, nonce, rowsCount, risk } = roundReplayInfo;
//   const getMultiplierIndex = (prove: FairnessProof) => {
//     const multiplierIndex = prove.randomizations
//       .slice(0, rowsCount)
//       .reduce((sum, curr) => sum + curr.randomNumber, 0);
//     return multiplierIndex;
//   };

//   const setRoundDeplayInfo = (key: keyof RoundReplayInfo, value: string) => {
//     updateReplayInfo(prev => ({
//       ...prev,
//       [key]: value,
//     }));
//   };

//   const onVerifyClick = async () => {
//     const fairnessProve = await connector.proveFairness({ serverSeed, clientSeed, nonce });
//     const multiplierIndex = getMultiplierIndex(fairnessProve);
//     const multipliers = MULTIPLIERS[rowsCount][risk];
//     const wonMultiplier = multipliers[multiplierIndex];
//     const frequency = MULTIPLIERS_FREQUENCIES[rowsCount][multiplierIndex];

//     proveFairnessState.setValue({
//       wonMultiplier,
//       risk,
//       rowsCount,
//       frequency,
//       randomizationJson: JSON.stringify(fairnessProve),
//     });
//   };

//   return (
//     <>
//       {proveFairnessState.value && (
//         <div className={styles.multiplierContainer}>
//           <PlinkoMultiplier
//             style={{ maxWidth: "55px" }}
//             $frequency={proveFairnessState.value.frequency}
//             $isanimationactive={"false"}
//             data-adaptive="false"
//           >
//             <span>{proveFairnessState.value.wonMultiplier}</span>
//             <span>x</span>
//           </PlinkoMultiplier>
//         </div>
//       )}

//       <div className="inputContainer">
//         <div className="inputLabel"> Client Seed</div>
//         <div className="inputWrapper" data-style="xl" data-color="grey">
//           <input
//             value={clientSeed}
//             onChange={e => {
//               const { value } = e.target;
//               setRoundDeplayInfo("clientSeed", value);
//             }}
//           />
//         </div>
//       </div>

//       <div className="inputContainer">
//         <div className="inputLabel">Nonce</div>
//         <div className="inputWrapper" data-style="xl" data-color="grey">
//           <input
//             value={nonce}
//             type="number"
//             onChange={e => {
//               const { value } = e.target;
//               setRoundDeplayInfo("nonce", value);
//             }}
//           />
//         </div>
//       </div>

//       <div className="inputContainer">
//         <div className="inputLabel">Server Seed</div>
//         <div className="inputWrapper" data-style="xl" data-color="grey">
//           <input
//             value={serverSeed}
//             onChange={e => {
//               const { value } = e.target;
//               setRoundDeplayInfo("serverSeed", value);
//             }}
//           />
//         </div>
//       </div>

//       <div className="inputContainer">
//         <div className="inputLabel">Risk </div>
//         <ComboBox
//           value={risk}
//           setValue={(risk: string) => setRoundDeplayInfo("risk", risk)}
//           items={RISK_LIST}
//         />
//       </div>

//       <div className="inputContainer">
//         <div className="inputLabel">Rows Count </div>
//         <ComboBox
//           value={rowsCount.toString()}
//           setValue={(rowsCount: string) => setRoundDeplayInfo("rowsCount", rowsCount)}
//           items={plinkoRowsList}
//         />
//       </div>

//       <div className="inputContainer">
//         <div className="inputLabel">Randomisation info</div>
//         <div className="inputWrapper" data-style="xl" data-color="grey">
//           <input value={proveFairnessState.value?.randomizationJson ?? ""} readOnly />
//           <CopyButton copyValue={proveFairnessState.value?.randomizationJson ?? ""} />
//         </div>
//       </div>

//       <Button
//         attributes={{
//           onClick: onVerifyClick,
//         }}
//         size="lg"
//         label="Verify"
//       />
//     </>
//   );
// };

// export default VerifyTab;
