type ValueUnit = "px" | "%";

export type FlexDragConfig = {
  x: string;
  y: string;
  width: string;
  height: string;
};

export type FlexValue<U extends ValueUnit = "px"> = {
  value: number;
  unit: U;
};
