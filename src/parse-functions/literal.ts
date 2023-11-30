import { Literal, PrattParser } from "../types";

export function literal(parser: PrattParser): Literal
{
  const { prevSymbol } = parser;

  let value: string | number | null | boolean | undefined

  try {
    value = JSON.parse(prevSymbol.value.replace(/^'|'$/g, '"'))
  } catch {
    throw Error(`Unknown literal value ${prevSymbol.value}`)
  }

  return {
    type: 'literal',
    value,
    loc: {
      start: parser.getPosition(prevSymbol, false),
      end: parser.getPosition(prevSymbol)
    }
  }
}