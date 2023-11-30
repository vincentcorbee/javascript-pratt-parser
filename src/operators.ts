import { Scope } from "./types";

type BinaryOperator = (lhs: any, rhs: any, env?: Scope) => any

type UnaryOperator = (argument: any, env?: Scope) => any

export const BinaryOperations = {
  "=": (lhs: any, rhs: any, env: Scope) => env.set(lhs, rhs),
  "==": (lhs: any, rhs: any) => lhs === rhs,
  "+": (lhs: any, rhs: any) => lhs + rhs,
  "-": (lhs: any, rhs: any) => lhs - rhs,
  "*": (lhs: any, rhs: any) => lhs * rhs,
  "%": (lhs: any, rhs: any) => lhs % rhs,
  "/": (lhs: any, rhs: any) => lhs / rhs,
  ">": (lhs: any, rhs: any) => lhs > rhs,
  "<": (lhs: any, rhs: any) => lhs < rhs,
  "&&": (lhs: any, rhs: any) => lhs && rhs,
  "&": (lhs: any, rhs: any) => lhs & rhs,
  "||": (lhs: any, rhs: any) => lhs || rhs,
  "|": (lhs: any, rhs: any) => lhs | rhs,
  ">=": (lhs: any, rhs: any) => lhs >= rhs,
  "<=": (lhs: any, rhs: any) => lhs <= rhs
} as { [key: string]: BinaryOperator }

export const UnaryOperations = {
  "-": (argument: any) => -argument,
  "!": (argument: any) => !argument,
  "++": (argument: any) => ++argument,
  "--": (argument: any) => --argument
} as { [key: string]: UnaryOperator }