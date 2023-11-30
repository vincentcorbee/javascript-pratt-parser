import { BlockStatement, PrattParser } from "../types"

export function blockStatement(parser: PrattParser): BlockStatement
{
  const start = parser.getPosition(parser.prevSymbol)

  const body = parser.parseStatements()

  parser.advance("right_curl_brace", "}")

  const end = parser.getPosition(parser.prevSymbol)

  return {
    type: 'block_stmt',
    body,
    loc: {
      start,
      end
    }
  }
}