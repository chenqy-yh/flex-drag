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
      unit: res[2] !== "px" && res[2] !== "" ? res[2] : "px",
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
 *  like "100%" -> { value: 100, unit: "px" }
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
      unit: numObj.unit,
    };
  } else {
    return {
      value: numObj.value,
      unit: numObj.unit,
    };
  }
};
