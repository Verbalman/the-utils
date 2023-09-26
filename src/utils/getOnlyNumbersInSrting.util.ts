
export const leftOnlyNumbersInString = (str: string): string => {
  if (!str) {
    return str;
  }

  return parseFloat(str)?.toString() ?? str;
}
