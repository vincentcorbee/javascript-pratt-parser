import { PrattParser, WhileStatement } from "../types";

export function whileStatement(parser: PrattParser): WhileStatement
{
  const start = parser.getPosition(parser.prevSymbol)

  parser.advance('left_paren', "(")

  const test = parser.parseExpression()

  parser.advance('right_paren', ")")

  const body = parser.parseStatement()

  const end = parser.getPosition(parser.prevSymbol)

  return {
    type: 'while_stmt',
    test,
    body,
    loc: {
      start,
      end
    }
  }
}