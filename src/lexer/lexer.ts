import { Keyword, LexerInterface, LexerOptions, LiteralType, Token, TokenType } from "./types"
import {
  hasData,
  peekChar,
  eatWhiteSpace,
  tokenCreate,
  eatChar,
  peekAt,
  isInteger,
  eatNumber,
  eatStringLiteral,
  isIdentifierStart,
  eatIdentifer,
  eatNewline,
  eatMultiLineComment,
  eatSingleLineComment
} from "./helpers";
import { throwError } from "../throw-error";

const Keywords = new Set<Keyword>(['typeof', 'let', 'function', 'return', 'while', 'for', 'break', 'else', 'if', 'const', 'of'])

const Literals = new Set<LiteralType>(['true', 'false', 'null'])

export class Lexer implements LexerInterface{
  index = 0;
  line = 1;
  col = 0;

  public ignoreWhiteSpace: boolean
  public ignoreNewLine: boolean
  public throws: boolean
  public ignoreComments: boolean

  constructor(public source: string, options: LexerOptions = {}) {
    this.ignoreWhiteSpace = options.ignoreWhiteSpace ?? true
    this.ignoreNewLine = options.ignoreNewline ?? true
    this.throws = options.throws ?? true
    this.ignoreComments = options.ignoreComments ?? true
  }

  peek(): Token
  {
    const {index, col, line} = this;

    const token = this.next();

    this.index = index;
    this.col = col;
    this.line = line

    return token;
  }

  lookahead(num: number): Token
  {
    const index = this.index

    while (num > 0) {
      num--

      this.advance();
    }

    const token = this.next()

    this.index = index;

    return token
  }

  expect(tokenType: TokenType): boolean
  {
    return this.peek().type === tokenType
  }

  advance(): void
  {
    this.next()
  }

  next(): Token
  {
    if (!hasData(this)) return {
      type: 'eof',
      value: ''
    };

    const nextChar = peekChar(this)

    switch(nextChar) {
      case ' ':
      case '\t':
      case '\r':
        const value = eatWhiteSpace(this)

        if(this.ignoreWhiteSpace) return this.next()

        return tokenCreate('whitespace', value)
      case '\n':
        {
          const value = eatNewline(this);

          if(this.ignoreNewLine) return this.next()

          return tokenCreate('newline', value)
        }
      case "+": {
        if (peekAt(this, 1) === '+') return tokenCreate('plus_plus', eatChar(this, 2))

        return tokenCreate('plus', eatChar(this))
      }
      case "-": return tokenCreate('min', eatChar(this))
      case "%": return tokenCreate('mod', eatChar(this))
      case "*": return tokenCreate('mul', eatChar(this))
      case "/": {
        const peekedChar = peekAt(this, 1)

        if (peekedChar === '*')
        {
          const comment = eatMultiLineComment(this);

          if(this.ignoreComments) return this.next();

          return tokenCreate('comment', comment)
        }

        if (peekedChar === '/')
        {
          const comment = eatSingleLineComment(this);

          if(this.ignoreComments) return this.next();

          return tokenCreate('comment', comment)
        }

        return tokenCreate('div', eatChar(this))
      }
      case '=': {
        if (peekAt(this, 1) === '=') return tokenCreate('eq', eatChar(this, 2))

        return tokenCreate('assign', eatChar(this))
      }
      case ">":
      {
        if (peekAt(this, 1) === '=') return tokenCreate('gt_eq', eatChar(this, 2))

        return tokenCreate('gt', eatChar(this))
      }
      case "<":
      {
        if (peekAt(this, 1) === '=') return tokenCreate('lt_eq', eatChar(this, 2))

        return tokenCreate('lt', eatChar(this))
      }
      case "&":
      {
        if (peekAt(this, 1) === '&') return tokenCreate('and', eatChar(this, 2))

        return tokenCreate('bin_and', eatChar(this))
      }
      case "|":
      {
        if (peekAt(this, 1) === '|') return tokenCreate('or', eatChar(this, 2))

        return tokenCreate('bin_or', eatChar(this))
      }
      case "?": return tokenCreate('ternary', eatChar(this))
      case ":": return tokenCreate('colon', eatChar(this))
      case ";": return tokenCreate('semi', eatChar(this))
      case "(": return tokenCreate('left_paren', eatChar(this))
      case ")": return tokenCreate('right_paren', eatChar(this))
      case ",": return tokenCreate('comma', eatChar(this))
      case ".": {
        if (isInteger(peekAt(this, 1))) return tokenCreate('number', eatChar(this) + eatNumber(this))

        return tokenCreate('dot', eatChar(this))
      }
      case "'":
      case '"': {
        const { value, error } = eatStringLiteral(this, nextChar)

        if (error) {
          if (this.throws) throwError('Unterminated string literal', this.line, this.col, this.index, this.source, this.source[this.index] ?? '')

          return tokenCreate('literal', value, 'Unterminated string literal')
        }

        return tokenCreate('literal', value)
      }
      case "[": return tokenCreate('left_brack', eatChar(this))
      case "]": return tokenCreate('right_brack', eatChar(this))
      case "{": return tokenCreate('left_curl_brace', eatChar(this))
      case "}": return tokenCreate('right_curl_brace', eatChar(this))
      case "!":
        if (peekAt(this, 1) === '!') return tokenCreate('bang_bang', eatChar(this, 2))

        return tokenCreate('bang', eatChar(this))

      default:
        if (isInteger(nextChar)) return tokenCreate('literal', eatNumber(this))

        if (isIdentifierStart(nextChar)) {
          const value = eatIdentifer(this)

          if (Keywords.has(value as any))  return tokenCreate(value as Keyword, value)

          if (Literals.has(value as any)) return tokenCreate('literal', value)

          return tokenCreate('identifier', value)
        }

        const errorMessage = `Lexer: Invalid syntax "${this.source[this.index]}"`

        if(this.throws) {
          throwError(
            errorMessage,
            this.line,
            this.col,
            this.index,
            this.source,
            nextChar
          )
        }

        else return tokenCreate('error', eatChar(this), errorMessage)
    }
  }

  *[Symbol.iterator]()
  {
    while (true) {
      const token = this.next()

      if (token.type === 'eof') break

      yield token
    }
  }
}
