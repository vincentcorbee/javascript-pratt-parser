import { FunctionDeclaration, FunctionExpression, Identifier, PrattParser } from "../types"
import { identifier } from "./identifier"

export function functionDeclarationOrExpression(parser: PrattParser): FunctionDeclaration | FunctionExpression
{
  const start = parser.getPosition(parser.prevSymbol)

  let id: null | Identifier = null

  let type: FunctionDeclaration['type'] | FunctionExpression['type'] = 'func_decl'

  if (parser.symbol.type === 'identifier') {
    parser.advance()

    id = identifier(parser)
  }

  else type = 'func_exp'

  parser.advance('left_paren', '(')

  const params: Identifier[] = []

  while(true) {
    const { symbol } = parser

    if (symbol.type === 'right_paren') break;

    if (symbol.type !== 'identifier') throw SyntaxError(`Unexpected token ${symbol.value}`)

    params.push({ name: symbol.value, type: 'identifier' })

    parser.advance()

    if (parser.symbol.type !== 'comma') break;

    parser.advance('comma', ',')
  }

  parser.advance("right_paren", ")")

  parser.advance('left_curl_brace', '{')

  const body = parser.parseStatements()

  parser.advance('right_curl_brace', '}')

  const end = parser.getPosition(parser.prevSymbol)

  return {
    type,
    id,
    body: { type: 'block_stmt', body },
    params,
    loc: {
      start,
      end
    }
  } as unknown as FunctionDeclaration | FunctionExpression
}