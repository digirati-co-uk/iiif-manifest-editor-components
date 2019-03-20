export const addAlphaToHex = (hex, a) => {
  let _hex = hex.replace('#', '');
  let r = parseInt(_hex.substring(0, 2), 16);
  let g = parseInt(_hex.substring(2, 4), 16);
  let b = parseInt(_hex.substring(4, 6), 16);
  return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
};
