export const getLabel = (labels, keys, defaultLabel) => {
  for (let key in keys) {
    if (labels[key]) {
      return labels[key];
    }
  }
  return defaultLabel;
};
