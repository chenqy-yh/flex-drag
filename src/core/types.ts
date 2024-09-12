type ValueUnit = "px" | "%";

export type FlexDragConfig = {
  x: string;
  y: string;
  width: string;
  height: string;
  dragable?: boolean;
};

export type FlexValue = {
  value: number;
  unit: ValueUnit;
};
