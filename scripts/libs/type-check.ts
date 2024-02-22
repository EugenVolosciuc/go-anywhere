export const checkIsEmpty = (value: string) => !value || value === "\\N";

export const checkIsNumber = (str: string) =>
  // @ts-ignore
  !isNaN(str) && !isNaN(parseFloat(str));
