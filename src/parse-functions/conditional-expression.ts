import { Expression, ConditionalExpression, PrattParser } from "../types";

export function conditionalExpression(parser: PrattParser, left: Expression): ConditionalExpression
{
  const test = left;
  const consequent = parser.parseExpression();

  parser.advance("colon", ':');

  const alternate = parser.parseExpression()

  return {
    type: "conditional_exp",
    test,
    consequent,
    alternate,
  }
}