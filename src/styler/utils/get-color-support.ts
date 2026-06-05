import { ColorDepth, ColorLevel, ColorSupport } from "../types"

const ColorDepthToLevel: { [color in ColorDepth]: ColorLevel }= {
  1: 0,
  4: 1,
  8: 2,
  24: 3
} as const

export const getColorSupport = (): ColorSupport => {
  const { COLORTERM: colorTerm, TERM: term } = globalThis.process !== undefined ? process.env : {}

  return {
    term,
    colorTerm,
    colorDepth: {
      stdout: ColorDepthToLevel[globalThis.process !== undefined ? process.stdout.getColorDepth() as ColorDepth : 24],
      stderr: ColorDepthToLevel[globalThis.process !== undefined ? process.stderr.getColorDepth() as ColorDepth : 24]
    }
  }
}