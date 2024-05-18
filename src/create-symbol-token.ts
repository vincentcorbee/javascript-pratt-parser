import { SymbolToken } from "./types"
import * as initialHandlers from "./handlers"
import { Token } from "./lexer/types"
import * as typeHandlers from './type-handlers'

export function createSymbolToken(token: Token, line: number, col: number, state: 'initial' | 'type'): SymbolToken {
  const { type } = token

  const { LED, NUD, STD } = state === 'initial' ? initialHandlers : typeHandlers

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