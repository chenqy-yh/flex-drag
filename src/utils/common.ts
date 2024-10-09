export const minmax = (x: number, min: number, max: number) => {
  const _min = Math.min(min, max);
  const _max = Math.max(min, max);
  return Math.max(_min, Math.min(_max, x));
};

export const debounce = <T extends any[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  let timer: NodeJS.Timeout;
  return (...args: T) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// 节流
export const throttle = <T extends any[]>(
  fn: (...args: T) => void,
  delay: number
) => {
  let timer: NodeJS.Timeout;
  return (...args: T) => {
    if (timer) return;
    timer = setTimeout(() => {
      fn(...args);
      clearTimeout(timer);
    }, delay);
  };
};