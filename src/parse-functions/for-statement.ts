import { ForOfStatement, ForStatement, PrattParser, VariableDeclaration } from "../types"

export function forStatement(parser: PrattParser): ForStatement | ForOfStatement
{
  parser.advance('left_paren', "(")

  let test = null

  let update = null

  let init = null

  if (parser.symbol.type !== 'semi') init = parser.parseExpression()

  /* ForOfStatement */

  if (parser.symbol.type === 'of' && init?.type === 'var_decl') {
    parser.advance('of', 'of')

    const right = parser.parseExpression()

    const left = init

    parser.advance('right_paren', ")")

    return {
      type: 'for_of_stmt',
      left,
      right,
      body: parser.parseStatement()
    } as ForOfStatement
  } else {
    parser.advance('semi', ';')

    if(parser.symbol.type !== 'semi') test = parser.parseExpression()

    parser.advance('semi', ';')

    if(parser.symbol.type !== 'right_paren') update = parser.parseExpression()

    parser.advance('right_paren', ")")

    return {
      type: 'for_stmt',
      init,
      test,
      update,
      body: parser.parseStatement()
    }
  }
}