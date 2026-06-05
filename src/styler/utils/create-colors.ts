import { SRGParameters } from "../constants";
import { ColorMode } from "../types";

export const fgColor = (code: number, mode: ColorMode): string => {
  return `${SRGParameters.setForeground};${mode};${code}`;
};

export const bgColor = (code: number, mode: ColorMode): string => {
  return `${SRGParameters.setBackground};${mode};${code}`;
};