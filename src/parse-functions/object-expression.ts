import { ObjectExpression, Property, PrattParser } from "../types"

export function objectExpression(parser: PrattParser): ObjectExpression
{
  const properties: Property[] = []

  const start = parser.getPosition(parser.prevSymbol)

  if (parser.symbol.type !== 'right_curl_brace') {
    while(true) {
      if(parser.symbol.type !== 'identifier' && parser.symbol.type !== 'literal' && parser.symbol.type !== 'comma') parser.throwError('Unexpected token')

      const start = parser.getPosition(parser.symbol, false)
      /* This can only by  */
      const key = parser.parseExpression() as any

      parser.advance('colon', ':')

      const value = parser.parseExpression()

      const property: Property = {
        type: 'property',
        key,
        kind: 'init',
        value,
        loc: {
          start,
          end: parser.getPosition(parser.prevSymbol)
        }
      }

      properties.push(property)

      if(parser.symbol.type !== 'comma') break;

      parser.advance('comma', ',')
    }
  }

  parser.advance('right_curl_brace', '}')

  const end = parser.getPosition(parser.prevSymbol)

  return {
    type: 'object_exp',
    properties,
    loc: {
      start,
      end
    }
  }
}