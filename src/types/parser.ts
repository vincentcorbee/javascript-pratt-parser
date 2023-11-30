import { TokenType, Token, Lexer } from "../lexer/types"
import { Expression, Statement, Position } from "./nodes"

export type PrattParserInterface = {
  lexer: Lexer
  symbol: SymbolToken
  prevSymbol: SymbolToken
  advance(type?: TokenType, expected?: string): SymbolToken
  parse(): Expression
  parseExpression(rbp?: number): Expression
  parseStatement(): Statement
  parseStatements(): Statement[]
  throwError(errorMessage: string): never
  getPosition(symbol: SymbolToken, withValue?: boolean): Position
}

export type PrattParser = PrattParserInterface

export type Nud = (parser: PrattParser) => Expression;

export type Std = (parser: PrattParser) => Statement;

export type Led = (parser: PrattParser, left: Expression) => Expression;

export type ParseRule = {
  nud?: Nud;
  led?: Led;
  std?: Std;
  lbp: number;
}

export type ParseRules = Record<string, ParseRule>

export type SymbolToken = Token & ParseRule & {
  line: number
  col: number
}

export type TokenLocation = { column: number, line: number }

export type HighlightCallback = (token: Token, location: TokenLocation) => string | null