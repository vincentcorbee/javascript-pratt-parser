import { BreakStatement, Identifier, PrattParser } from "../types"

export function breakStatement(parser: PrattParser): BreakStatement
{
  const start = parser.getPosition(parser.prevSymbol, false)

  const label: Identifier | null = parser.symbol.type === 'identifier' ? { type: 'identifier', name: parser.symbol.value } : null

  if (label) parser.advance()

  parser.advance('semi', ';')

  const end = parser.getPosition(parser.prevSymbol)

  return {
    type: 'break_stmt',
    label,
    loc: {
      start,
      end
    }
  }
}