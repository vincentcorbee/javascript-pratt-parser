import { Expression, PrattParser } from "../types";

export function parenthesizedExpression(parser: PrattParser): Expression
{
  const expr = parser.parseExpression();

  parser.advance('right_paren', ")")

  return expr
}