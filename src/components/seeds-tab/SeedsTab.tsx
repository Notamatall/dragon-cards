// import { useCallback, useMemo, useState } from "react";
// import CopyButton from "../copy-button/CopyButton";
// import styles from "./styles.module.scss";
// import { ProvablyFairPanel } from "types/index";
// import Button from "../button/Button";

// interface SeedsTabProps {
//   roundRngState: ProvablyFairRoundState;
//   onVerifyClick: () => void;
//   refetchRngState: () => Promise<void>;
// }

// const SeedsTab = ({ roundRngState, onVerifyClick, refetchRngState }: SeedsTabProps) => {
//   const [newClientSeed, setNewClientSeed] = useState<string>("");
//   const [clientSeedInError, setClientSeedInError] = useState(false);
//   const serverSeedText = useMemo(() => {
//     return roundRngState.serverSeed ? "Server seed" : "Server seed (hashed)";
//   }, [roundRngState]);

//   const onNewClientSeedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { value } = e.target;
//     setNewClientSeed(value);
//     setClientSeedInError(false);
//   };

//   const rotateBtnText = useMemo(() => {
//     return roundRngState.serverSeed ? "Verify" : "Rotate";
//   }, [roundRngState]);

//   const rotateSeeds = useCallback(async () => {
//     try {
//       const clientSeed = await connector.updateClientSeed(newClientSeed);
//       setNewClientSeed(clientSeed.clientSeed);
//       await refetchRngState();
//     } catch (error: any) {
//       setClientSeedInError(true);
//       console.error(error);
//     }
//   }, [connector, newClientSeed, refetchRngState]);

//   const rotateBtnAction = useCallback(async () => {
//     return roundRngState.serverSeed ? onVerifyClick() : rotateSeeds();
//   }, [onVerifyClick, rotateSeeds, roundRngState.serverSeed]);

//   const serverSeedValue = useMemo(() => {
//     return roundRngState.serverSeed ? roundRngState.serverSeed : roundRngState.serverSeedHash;
//   }, [roundRngState]);

//   return (
//     <>
//       <div className="inputContainer">
//         <div className="inputLabel"> Client Seed</div>
//         <div className="inputWrapper" data-style="xl" data-color="grey">
//           <input value={roundRngState.clientSeed} readOnly={true} />
//           <CopyButton copyValue={roundRngState.clientSeed} />
//         </div>
//       </div>

//       <div className="inputContainer">
//         <div className="inputLabel">Nonce</div>
//         <div className="inputWrapper" data-style="xl" data-color="grey">
//           <input value={roundRngState.nonce} readOnly={true} />
//           <CopyButton copyValue={roundRngState.nonce.toString()} />
//         </div>
//       </div>

//       <div className="inputContainer">
//         <div className="inputLabel">{serverSeedText}</div>
//         <div className="inputWrapper" data-style="xl" data-color="grey">
//           <input value={serverSeedValue} readOnly={true} />
//           <CopyButton copyValue={serverSeedValue} />
//         </div>
//       </div>

//       {roundRngState && !roundRngState.serverSeed && (
//         <div className="inputContainer">
//           <div className="inputLabel">
//             New client seed <span className={styles.mandatory}>*</span>
//           </div>
//           <div
//             className="inputWrapper"
//             data-in-error={clientSeedInError}
//             data-error-text={"Max length 64 characters"}
//             data-style="xl"
//             data-color="grey"
//           >
//             <input
//               value={newClientSeed}
//               placeholder="Enter client seed you want to use"
//               onChange={onNewClientSeedChange}
//             />
//             <CopyButton copyValue={newClientSeed} />
//           </div>
//         </div>
//       )}

//       {roundRngState && roundRngState.serverSeed ? null : (
//         <div className={styles.centeredFlex}>
//           <span className={styles.verifyText}>
//             To verify this bet, you need to rotate your seed pair
//           </span>
//         </div>
//       )}
//       <Button
//         style="secondary"
//         size="lg"
//         attributes={{ onClick: rotateBtnAction }}
//         label={rotateBtnText}
//       />
//     </>
//   );
// };

// export default SeedsTab;
