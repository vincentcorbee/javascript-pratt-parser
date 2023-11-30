import { Expression, CallExpression, PrattParser } from "../types"
import { parseArguments } from "./parse-arguments"

export function callExpression(parser: PrattParser, left: Expression): CallExpression
{
  const args = parseArguments(parser)

  parser.advance("right_paren", ")")

  return {
    type: 'call_exp',
    callee: left,
    arguments: args
  } as CallExpression
}