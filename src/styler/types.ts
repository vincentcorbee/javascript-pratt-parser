import { StandardColorCodes, HighIntensityColorCodes, SRGParameters } from "./constants";

export type StylerOptions = {
  colorLevel?: ColorLevel;
};

export interface StylerInstance {
  (...text: unknown[]): string;
  readonly bold: StylerInstance;
  readonly dim: StylerInstance;
  readonly italic: StylerInstance;
  readonly underline: StylerInstance;
  readonly reset: StylerInstance;
  readonly strikethrough: StylerInstance;
  readonly visible: StylerInstance;
  readonly blink: StylerInstance;

  readonly red: StylerInstance;
  readonly green: StylerInstance;
  readonly yellow: StylerInstance;
  readonly orange: StylerInstance;
  readonly blue: StylerInstance;
  readonly cyan: StylerInstance;
  readonly magenta: StylerInstance;
  readonly white: StylerInstance;

  readonly gray: StylerInstance;
  readonly brightRed: StylerInstance;
  readonly brightGreen: StylerInstance;
  readonly brightYellow: StylerInstance;
  readonly brightBlue: StylerInstance;
  readonly brightCyan: StylerInstance;
  readonly brightMagenta: StylerInstance;
  readonly brightWhite: StylerInstance;

  readonly bgBlack: StylerInstance;
  readonly bgRed: StylerInstance;
  readonly bgGreen: StylerInstance;
  readonly bgYellow: StylerInstance;
  readonly bgBlue: StylerInstance;
  readonly bgMagenta: StylerInstance;
  readonly bgCyan: StylerInstance;
  readonly bgWhite: StylerInstance;

  readonly bgBrightBlack: StylerInstance;
  readonly bgBrightRed: StylerInstance;
  readonly bgBrightGreen: StylerInstance;
  readonly bgBrightYellow: StylerInstance;
  readonly bgBrightBlue: StylerInstance;
  readonly bgBrightMagenta: StylerInstance;
  readonly bgBrightCyan: StylerInstance;
  readonly bgBrightWhite: StylerInstance;

  readonly alternativeFont1: StylerInstance;

  readonly rgb: (r: number, b: number, c: number) => StylerInstance;
  readonly bgRgb: (r: number, b: number, c: number) => StylerInstance;
  readonly fg256: (color: number) => StylerInstance;
  readonly bg256: (color: number) => StylerInstance;

  readonly styles: Array<string | number>;
  readonly colorLevel: ColorLevel
}

export type ColorSupport = {
  term?: string
  colorTerm?: string
  colorDepth: {
    stdout: ColorLevel,
    stderr: ColorLevel
  }
}

export type ColorLevel = 0 | 1 | 2 | 3;

export type ColorDepth = 1 | 4 | 8 | 24

export type ColorMode = 'rgb' | 'index' | 'standard'

export type SRGParameter = keyof typeof SRGParameters

export type ColorCodes = typeof StandardColorCodes[keyof typeof StandardColorCodes] | typeof HighIntensityColorCodes[keyof typeof HighIntensityColorCodes];