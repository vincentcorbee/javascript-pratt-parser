import { PrattParser, VariableStatement } from "../types";
import { variableDeclaration } from "./variable-declaration";

export function variableStatement(parser: PrattParser): VariableStatement
{
  const decl = variableDeclaration(parser)

  parser.advance('semi', ';')

  if(decl.loc) decl.loc.end = parser.getPosition(parser.prevSymbol)

  return decl
}