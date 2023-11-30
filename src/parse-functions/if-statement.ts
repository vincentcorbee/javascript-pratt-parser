import { IfStatement, Statement, PrattParser } from "../types"

export function ifStatement(parser: PrattParser): IfStatement
{
  const start = parser.getPosition(parser.prevSymbol)

  parser.advance('left_paren', "(")

  const test = parser.parseExpression()

  parser.advance('right_paren', ")")

  const consequent = parser.parseStatement()

  let alternate: Statement | null = null

  if (parser.symbol.type === 'else') {
    parser.advance()

    alternate = parser.parseStatement()
  }

  const end = parser.getPosition(parser.prevSymbol)

  return {
    type: 'if_stmt',
    test,
    consequent,
    alternate,
    loc: {
      start,
      end
    }
  }
}