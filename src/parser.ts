import { throwError } from "./throw-error"
import { Lexer } from "./lexer/lexer"
import {
  Expression,
  SymbolToken,
  PrattParserInterface,
  Statement,
  Program,
  Position
} from "./types"
import { createSymbolToken } from "./create-symbol-token"
import { program } from "./parse-functions"
import { TokenType } from "./lexer/types"

export class PrattParser implements PrattParserInterface{
  public lexer: Lexer
  public symbol: SymbolToken
  public prevSymbol: SymbolToken
  public state: 'initial' | 'type'

  private started = false

  constructor(source: string)
  {
    this.state = 'initial'
    this.lexer = new Lexer(source)
    this.symbol = this.prevSymbol = createSymbolToken({ type: 'eof', value: '' }, 1, 0, this.state)
  }

  getPosition(symbol: SymbolToken, withValue = true): Position
  {
    return {
      line: symbol.line,
      column: symbol.col + (withValue ? symbol.value.length : 0)
    }
  }

  setState(state: 'initial' | 'type'): void
  {
    this.state = state

    const { value, type, error, line, col } = this.symbol

    this.symbol = createSymbolToken({ value, type, error }, line, col, state)
  }

  throwError(errorMessage: string): never
  {
    const { source, index, line } = this.lexer
    const { value, col } = this.symbol

    throwError(errorMessage, line, col ,index, source, value);
  }

  advance(type?: TokenType, expected?: string): SymbolToken
  {
    const { symbol } = this

    if (type && type !== symbol.type) this.throwError(`Unexpected token "${symbol.value}"${expected ? ` Expected "${expected}"` : ''}`)

    this.prevSymbol = symbol

    if (this.lexer.expect('eof')) return this.symbol = createSymbolToken({ type: 'eof', value: '' }, this.lexer.line, this.lexer.col, this.state)

    const token =  this.lexer.next()

    const { line, col } = this.lexer

    return this.symbol = createSymbolToken(token, line, col - token.value.length, this.state)
  }

  parseExpression(rbp = 0): Expression
  {
    let symbol = this.symbol

    if (!symbol.nud) this.throwError(`Unexpected token "${symbol.value}"`)

    this.advance()

    let left = symbol.nud(this);

    while (rbp < this.symbol.lbp) {
      symbol = this.symbol

      if(!symbol.led) this.throwError(`Unexpected token "${symbol.value}"`)

      this.advance();

      left = symbol.led(this, left);
    }

    return left;
  }

  parseStatement(): Statement
  {
    if (!this.started) {
      this.started = true;

      this.advance()
    }

    const start = this.getPosition(this.prevSymbol)

    const { symbol } = this

    if (symbol.std) {
        this.advance();

        return symbol.std(this);
    }

    const { index, col, line, source } = this.lexer

    const expression = this.parseExpression()

    /* FunctionExpression not allowed */

    if(expression.type === 'func_exp') throwError(`Unexpected token "("`, line, col ,index, source, '');

    if (expression.type === 'func_decl') return expression

    this.advance("semi", ";")

    const end = this.getPosition(this.prevSymbol)

    return {
      type: 'exp_stmt',
      expression,
      loc: {
        start,
        end
      }
    }
  }

  parseStatements(): Statement[]
  {
    if (!this.started) {
      this.advance()

      this.started = true;
    }

    const statements: Statement[] = []

    let stmt: Statement | null = null

    while (true) {
      if (this.symbol.type === 'right_curl_brace' || this.symbol.type === 'eof') break;

      stmt = this.parseStatement()

      if(stmt) statements.push(stmt)
    }

    return statements
  }

  parseProgram(): Program
  {
    if (!this.started) {
      this.advance()

      this.started = true;
    }

    return program(this)
  }

  parse(): Expression {
    this.advance()

    this.started = true

    return this.parseExpression()
  }
}