import { ArrayExpression, Expression, PrattParser } from "../types"

export function arrayExpression(parser: PrattParser): ArrayExpression
{
  const elements: Expression[] = []

  const start = parser.getPosition(parser.prevSymbol)

  if (parser.symbol.type !== 'right_brack') {
    while(true) {
      elements.push(parser.parseExpression())

      if(parser.symbol.type !== 'comma') break;

      parser.advance('comma', ',')
    }
  }

  parser.advance('right_brack', ']')

  const end = parser.getPosition(parser.prevSymbol)

  return {
    type: 'array_exp',
    elements,
    loc: {
      start,
      end
    }
  }
}