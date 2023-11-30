import { ReturnStatement, PrattParser } from "../types";

export function returnStatement(parser: PrattParser): ReturnStatement
{
  const start = parser.getPosition(parser.prevSymbol)

  const argument = parser.parseExpression()

  parser.advance('semi', ';')

  const end = parser.getPosition(parser.prevSymbol)

  return {
    type: 'return_stmt',
    argument,
    loc: {
      start,
      end
    }
  }
}