const singleAmountRegex = /\$\s*([\d.]+)/;
const rangeAmountRegex = /\$\s*([\d.]+)\s*-\s*([\d.]+)/;

function extractNumericPart(
  match: RegExpMatchArray | null,
  index: number
): number | undefined {
  return match && match[index] ? parseFloat(match[index]) : undefined;
}

export const getDollarAmount = (text: string) => {
  const textWithoutSpaces = text.replaceAll(" ", "").replace(/\s+/g, "");
  const matchRange = rangeAmountRegex.exec(textWithoutSpaces);

  const rangeLower = extractNumericPart(matchRange, 1);
  const rangeUpper = extractNumericPart(matchRange, 2);

  if (rangeLower && rangeUpper) {
    if (rangeLower && rangeUpper) return (rangeLower + rangeUpper) / 2;
    return null;
  } else {
    const matchSingle = singleAmountRegex.exec(textWithoutSpaces);

    return extractNumericPart(matchSingle, 1);
  }
};
