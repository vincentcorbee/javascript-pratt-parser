import { Expression, BinaryExpression, PrattParser } from "../types";

export function binaryExpression(parser: PrattParser, lhs: Expression): BinaryExpression
{
  const { lbp, value } = parser.prevSymbol;

  return {
    type: 'binary_exp',
    left: lhs,
    operator: value,
    right: parser.parseExpression(lbp)
  }
}