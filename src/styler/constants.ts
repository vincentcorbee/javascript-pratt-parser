// import { getColorSupport } from "./utils";

import { getColorSupport } from './utils/get-color-support'

export const colorSupport = getColorSupport()

export const C0ControlCodes = {
  esc: '\x1b',
} as const;

export const FEEscapeSequences = {
  CSI: `${C0ControlCodes.esc}[`,
} as const;

export const SRGParameters = {
  reset: 0,
  bold: 1,
  dim: 2,
  italic: 3,
  underline: 4,
  blink: 5,
  invert: 7,
  strikethrough: 9,
  alternativeFont1: 11,
  normalIntensity: 22,
  notUnderlined: 24,
  notStrikethrough: 29,
  black: 30,
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  white: 37,
  setForeground: 38,
  defaultForeground: 39,
  bgBlack: 40,
  bgRed: 41,
  bgFreen: 42,
  bgYellow: 43,
  bgBlue: 44,
  bgMagenta: 45,
  bgCyan: 46,
  bgWhite: 47,
  setBackground: 48,
  gray: 90,
  brightRed: 91,
  brightGreen: 92,
  brightYellow: 93,
  brightBlue: 94,
  brightMagenta: 95,
  brightCyan: 96,
  brightWhite: 97,
  bgBrightGray: 100,
  bgBrightRed: 101,
  bgBrightGreen: 102,
  bgBrightYellow: 103,
  bgBrightBlue: 104,
  bgBrightMagenta: 105,
  bgBrightCyan: 106,
  bgBrightWhite: 107,
} as const;

export const ColorModes = {
  rgb: 2,
  index: 5,
};

export const StandardColorCodes = {
  black: 0,
  red: 1,
  green: 2,
  yellow: 3,
  blue: 4,
  magenta: 5,
  cyan: 6,
  white: 7,
} as const;

export const HighIntensityColorCodes = {
  gray: 8,
  brightRed: 9,
  brightGreen: 10,
  brightYellow: 11,
  brightBlue: 12,
  brightMagenta: 13,
  brightCyan: 14,
  brightWhite: 15,
} as const;

export const regExpStyle = new RegExp(`(?:((?:${C0ControlCodes.esc}\\[[0-9;]+m)+)(.*?)(${C0ControlCodes.esc}\\[0m))`, 'g');