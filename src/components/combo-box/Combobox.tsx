// import { useEffect, useRef, useState } from "react";
// import styles from "./styles.module.scss";
// import { getProviderGamePath } from "utils/index";

// interface ComboBoxProps {
//   items: string[];
//   value: string;
//   setValue: (value: string) => void;
// }
// function ComboBox({ items, value, setValue }: ComboBoxProps) {
//   const [isOpen, setIsOpen] = useState(false);
//   const comboboxRef = useRef<null | HTMLDivElement>(null);
//   const handleOptionClick = (option: string) => {
//     setValue(option);
//     setIsOpen(false);
//   };

//   const handleClickOutside = (event: MouseEvent) => {
//     if (comboboxRef.current && !comboboxRef.current.contains(event.target)) {
//       setIsOpen(false);
//     }
//   };

//   useEffect(() => {
//     document.addEventListener("mousedown", handleClickOutside);

//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   return (
//     <div
//       className="inputWrapper"
//       ref={comboboxRef}
//       data-style="xl"
//       data-color="grey"
//       data-interactive={true}
//       onClick={() => setIsOpen(prev => !prev)}
//     >
//       <input readOnly type="search" value={value} placeholder="Select risk type" />
//       <div className={styles.comboboxArrowsContainer}>
//         <img src={getProviderGamePath("images", "arrows.svg")} width={18} height={18} />
//       </div>
//       {isOpen && (
//         <ul className={styles.comboboxList}>
//           {items.map(option => (
//             <li
//               key={option}
//               onClick={e => {
//                 e.stopPropagation();
//                 handleOptionClick(option);
//               }}
//             >
//               {option}
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

// export default ComboBox;
