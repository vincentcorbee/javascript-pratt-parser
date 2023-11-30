import { Expression, UpdateExpression, PrattParser } from "../types"

export function updateExpression(parser: PrattParser, left: Expression): UpdateExpression {

  const argument = left || parser.parseExpression()

  if (argument.type !== 'identifier' && argument.type !== 'member_exp') throw SyntaxError(`Invalid left-hand side in prefix operation.`)

  const prefix = left === undefined

  if (!left) parser.advance()

  return {
    type: 'update_exp',
    operator: parser.prevSymbol.value,
    argument,
    prefix
  }
}