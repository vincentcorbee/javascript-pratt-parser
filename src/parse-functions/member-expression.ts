import { Expression, CallExpression, MemberExpression, PrattParser } from "../types"
import { parseArguments } from "./parse-arguments"
import { identifier } from "./identifier"

export function memberExpression(parser: PrattParser, left: Expression)
{
  let start = parser.getPosition(parser.prevSymbol)

  parser.advance('identifier', "identifier")

  let node: CallExpression | MemberExpression = {
    type: 'member_exp',
    property: identifier(parser),
    object: left,
    loc: {
      start,
      end: parser.getPosition(parser.prevSymbol)
    }
  } as MemberExpression

  while(parser.symbol.type === 'dot' || parser.symbol.type === 'left_paren') {
    parser.advance()

    start = parser.getPosition(parser.prevSymbol)

    if (parser.prevSymbol.type ==='left_paren') {
      const args = parseArguments(parser)

      parser.advance("right_paren", ")")

      node = {
        type: 'call_exp',
        arguments: args,
        callee: node,
        loc: {
          start,
          end: parser.getPosition(parser.symbol)
        }
      } as CallExpression

    } else {
      parser.advance('identifier', "identifier")

      node = {
        type: 'member_exp',
        property: identifier(parser),
        object: node,
        loc: {
          start,
          end: parser.getPosition(parser.prevSymbol)
        }
      } as MemberExpression
    }
  }

  return node
}