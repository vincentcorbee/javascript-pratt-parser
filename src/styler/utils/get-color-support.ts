import { ColorDepth, ColorLevel, ColorSupport } from "../types"

const ColorDepthToLevel: { [color in ColorDepth]: ColorLevel }= {
  1: 0,
  4: 1,
  8: 2,
  24: 3
} as const

/* getColorDepth only exists on TTY streams; fall back to 1 (no color) for
   piped / non-interactive output, where calling it would throw. */
const getColorDepth = (stream?: { getColorDepth?: () => number }): ColorDepth =>
  stream && typeof stream.getColorDepth === 'function' ? (stream.getColorDepth() as ColorDepth) : 1

export const getColorSupport = (): ColorSupport => {
  const hasProcess = globalThis.process !== undefined
  const { COLORTERM: colorTerm, TERM: term } = hasProcess ? process.env : {}

  return {
    term,
    colorTerm,
    colorDepth: {
      stdout: ColorDepthToLevel[hasProcess ? getColorDepth(process.stdout) : 1],
      stderr: ColorDepthToLevel[hasProcess ? getColorDepth(process.stderr) : 1]
    }
  }
}