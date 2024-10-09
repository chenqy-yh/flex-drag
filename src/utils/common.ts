export const minmax = (x: number, min: number, max: number) => {
  const _min = Math.min(min, max);
  const _max = Math.max(min, max);
  return Math.max(_min, Math.min(_max, x));
};
