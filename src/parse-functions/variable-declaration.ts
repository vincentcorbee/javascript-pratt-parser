import { PrattParser, VariableDeclaration, VariableDeclarator, VariableKind } from "../types"
import { identifier } from "./identifier"

export function variableDeclaration(parser: PrattParser): VariableDeclaration
{
  const declarations: VariableDeclarator[] = []

  const { prevSymbol: { value: kind }} = parser

  const start = parser.getPosition(parser.prevSymbol)

  while(parser.symbol.type === 'identifier') {
    parser.advance()

    const declaration: VariableDeclarator = {
      type: 'var_declr',
      id: identifier(parser),
      init: null
    }

    // @ts-ignore
    if (parser.symbol.type === 'colon') {
      // console.log('TYPE ANNOTATION');
      // parser.setState('type')

      // parser.advance()

      // parser.parseExpression()

      // console.log(parser.symbol)
    }

    // @ts-ignore
    if (parser.symbol.type === 'assign') {
      parser.advance('assign')

      declaration.init = parser.parseExpression()
    }

    declarations.push(declaration)

    // @ts-ignore
    if(parser.symbol.type !== 'comma') break;

    parser.advance('comma')
  }

  if (declarations.length === 0) throw parser.throwError('Expected identifier')

  const end = parser.getPosition(parser.prevSymbol)

  return {
    type: 'var_decl',
    kind: kind as VariableKind,
    declarations,
    loc: {
      start,
      end
    }
  }
}