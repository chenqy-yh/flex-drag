import { FlexValue } from "./types";

/**
 *  generate a random id
 *  like 0.4fzyo82mvyr -> yo82mvyr
 */
export const genId = () => {
  return Math.random().toString(36).slice(-6);
};

/**
 *  get number and unit from a string
 * like "100px" -> { value: 100, unit: "px" }
 */
export const formattedFlexValue = (str: string): FlexValue => {
  const reg = /([0-9]+\.*[0-9]*)\s*([a-zA-Z%]*)/gi;
  const res = reg.exec(str);
  if (res) {
    return {
      value: parseFloat(res[1]) || 0,
      unit: res[2] === "px" || res[2] === "%" ? res[2] : "px",
    };
  } else {
    return {
      value: 0,
      unit: "px",
    };
  }
};

/**
 *  unify the value to px
 *  like "100%" -> { value: 100, unit: "%" }
 *        "10px" -> { value: 10, unit: "px" }
 */
export const unify = (str: string, refer = window.innerWidth): FlexValue => {
  if (!str) {
    return {
      value: 0,
      unit: "px",
    };
  }
  const numObj = formattedFlexValue(str);
  if (numObj.unit === "%") {
    return {
      value: (numObj.value * refer) / 100,
      unit: "px",
    };
  } else {
    return {
      value: numObj.value,
      unit: numObj.unit,
    };
  }
};

export const calcFlexValue = (
  x: FlexValue,
  y: FlexValue,
  refer = window.innerWidth
): FlexValue => {
  if (!refer || isNaN(refer) || refer === 0) {
    throw new Error("Invalid refer");
  }
  if (x.unit === y.unit) {
    return {
      value: x.value + y.value,
      unit: x.unit,
    };
  }
  if (x.unit === "px") {
    return {
      value: x.value + y.value * refer,
      unit: "px",
    };
  } else if (x.unit === "%") {
    return {
      value: x.value + (y.value / refer) * 100,
      unit: "%",
    };
  } else {
    throw new Error("Invalid unit");
  }
};

export const resolveFlexValue = (
  value: string | FlexValue,
  baseVal: number
) => {
  if (typeof value === "string") return unify(value, baseVal);
  else return value;
};

export const toPx = (flexValue: FlexValue, refer: number) => {
  if (flexValue.unit === "px") return flexValue.value;
  else if (flexValue.unit === "%") return (flexValue.value * refer) / 100;
  else return 0;
};

export const calcWithBound = (value: number, max: number, min: number) => {
  return value > max ? max : value < min ? min : value;
};
