export type Keyword =
    'typeof'
  | 'let'
  | 'const'
  | 'function'
  | 'for'
  | 'while'
  | 'return'
  | 'of'
  | 'break'
  | 'if'
  | 'else'

export type LiteralType = 'true' | 'false' | 'null'

export type TokenType =
    Keyword
  | (
    | 'identifier'
    | 'number'
    | 'dot'
    | 'comma'
    | 'left_paren'
    | 'right_paren'
    | 'left_brack'
    | 'right_brack'
    | 'left_curl_brace'
    | 'right_curl_brace'
    | 'eof'
    | 'newline'
    | 'ternary'
    | 'colon'
    | 'plus'
    | 'plus_plus'
    | 'min'
    | 'mul'
    | 'mod'
    | 'div'
    | 'assign'
    | 'eq'
    | 'bang'
    | 'bang_bang'
    | 'semi'
    | 'gt'
    | 'lt'
    | 'lt_eq'
    | 'gt_eq'
    | 'and'
    | 'or'
    | 'bin_and'
    | 'bin_or'
    | 'literal'
    | 'newline'
    | 'whitespace'
    | 'error'
    | 'comment'
  )

export type Token = {
  value: string
  type: TokenType
  error?: string
}

export type ErrorToken = {
  error: string
  token: 'error'
} & Token

export type LexerInterface = {
  index:  number
  source: string
  col: number
  line: number
  peek(): Token
  lookahead(num: number): Token
  expect(tokenType: TokenType): boolean
  advance(): void
  next(): Token
  [Symbol.iterator](): Iterator<Token>
}

export type LexerOptions = {
  ignoreWhiteSpace?: boolean
  ignoreNewline?: boolean
  ignoreComments?: boolean
  throws?: boolean
}

export type Lexer = LexerInterface