export const isEmpty = (value: any): boolean => {
  if (
    value === undefined ||
    value === null ||
    value === 'null' ||
    value === 'NA'
  ) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (typeof value === 'object') {
    return value !== null && Object.keys(value).length === 0;
  }

  return false;
};
