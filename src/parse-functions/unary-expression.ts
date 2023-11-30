import { UnaryExpression, PrattParser } from "../types";

export function unaryExpression(parser: PrattParser): UnaryExpression
{
  const { lbp, value } = parser.prevSymbol;

  return {
    type: 'unary_exp',
    operator: value,
    argument: parser.parseExpression(lbp)
  }
}