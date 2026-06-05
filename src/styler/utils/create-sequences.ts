import { FEEscapeSequences, SRGParameters } from "../constants";

export const createSequences = (styles: (number | string)[]): readonly [string, string] => {
  let resetSequences = '';

  const sequences = styles.reduce((acc, style) => {
    if (typeof style === 'number') {
      let code;

      switch (style) {
        case 1:
          code = 22;
          break;
        case 2:
        case 3:
        case 4:
        case 5:
        case 9:
          code = style + 20;
          break;
        default:
          break;
      }

      if (code !== undefined) resetSequences += `${FEEscapeSequences.CSI}${code}m`;
    }

    return `${acc}${FEEscapeSequences.CSI}${style}m`;
  }, '') as string;

  resetSequences += `${FEEscapeSequences.CSI}${SRGParameters.reset}m`;

  return [sequences, resetSequences] as const;
};