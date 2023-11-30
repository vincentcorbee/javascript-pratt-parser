import { Expression, PrattParser } from "../types"

export function parseArguments(parser: PrattParser): Expression[]
{
  if (parser.symbol.type === 'right_paren') return  []

  const args = [parser.parseExpression()]

  while(parser.symbol.type === 'comma') {
    parser.advance('comma')

    args.push(parser.parseExpression())
  }

  return args
}