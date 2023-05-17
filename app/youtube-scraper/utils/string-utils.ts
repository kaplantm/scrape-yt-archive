export const pluralize = (str: string, val: number) =>
  !val || val > 1 ? `${str}s` : str;
