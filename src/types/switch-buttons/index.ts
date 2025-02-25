export interface ISwitchButton {
  label: string;
  disabled?: boolean;
  onClick: () => any;
  isActive: boolean;
}
