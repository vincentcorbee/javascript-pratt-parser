import { SymbolToken } from "./types"
import { LED, NUD, STD } from "./handlers"
import { Token } from "./lexer/types"

export function createSymbolToken(token: Token, line: number, col: number): SymbolToken {
  const { type, value } = token

  const name = type

  const nud = NUD[name]
  const led = LED[name]
  const std = STD[name]

  if(!nud && !led && !std) throw Error(`No handler function found for "${name}"`)

  if (nud && nud.lbp === undefined) nud.lbp = 0

  if (led && led.lbp === undefined) led.lbp = 0

  if (std && std.lbp === undefined) std.lbp = 0

  return {
    ...token,
    ...nud,
    ...led,
    ...std,
    line,
    col
  }
}