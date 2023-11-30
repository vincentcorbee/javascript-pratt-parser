import { Identifier, PrattParser } from "../types";

export function identifier(parser: PrattParser): Identifier
{
  const { prevSymbol } = parser

  return {
    type: 'identifier',
    name: prevSymbol.value,
    loc: {
      start: parser.getPosition(prevSymbol, false),
      end: parser.getPosition(prevSymbol)
    }
  }
}