import { Program, PrattParser } from "../types"

export function program(parser: PrattParser): Program
{
  const start = parser.getPosition(parser.prevSymbol)

  const body = parser.parseStatements()

  const end = parser.getPosition(parser.prevSymbol)

  return {
    type: 'prog',
    body,
    loc: {
      start,
      end
    }
  }
}