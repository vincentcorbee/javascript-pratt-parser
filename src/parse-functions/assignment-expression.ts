import { Identifier, AssignmentExpression, PrattParser } from "../types";

export function assignmentExpression(parser: PrattParser, left: Identifier): AssignmentExpression
{
  return {
    type: "assign_exp",
    operator: parser.prevSymbol.value,
    left,
    right: parser.parseExpression()
  }
}