import { styler } from "@digitalbranch/styler"
import { Lexer } from "./lexer/lexer"
import { HighlightCallback } from "./types"
import { Token } from "./lexer/types"

const white = styler.colorLevel === 3 ? styler.rgb(213, 222, 235) : styler.white
const purple = styler.colorLevel === 3 ? styler.rgb(182, 145, 235) : styler.fg256(141)
const cyan = styler.colorLevel === 3 ? styler.rgb(127, 219, 202) : styler.cyan
const green = styler.colorLevel === 3 ? styler.rgb(197, 228, 121) : styler.fg256(190)
const brightGreen = styler.colorLevel === 3 ? styler.rgb(217, 245, 221) : styler.fg256(290)
const blue = styler.colorLevel === 3 ? styler.rgb(22, 159, 255) : styler.fg256(27)
const brightblue = styler.colorLevel === 3 ?  styler.rgb(130, 170, 255) : styler.fg256(153)
const red = styler.colorLevel === 3 ? styler.rgb(255, 88, 116) : styler.fg256(197)
const brightRed = styler.colorLevel === 3 ? styler.rgb(248, 140, 108) : styler.fg256(203)
const yellow = styler.colorLevel === 3 ? styler.rgb(237, 195, 141) : styler.fg256(220)
const brightYellow = styler.colorLevel === 3 ? styler.rgb(255, 214, 2) : styler.fg256(226)
const gray = styler.gray

export function highlight(source: string, cb?: HighlightCallback): string
{
  let blockLevel = 0;

  let highlightedSource = ''

  const lexer = new Lexer(source, { ignoreNewline: false, ignoreWhiteSpace: false, throws: false, ignoreComments: false })

  let prevToken: Token | null = null

  for(let tok of lexer) {
    const { value, type } = tok

    lexer.ignoreWhiteSpace = true

    const nextToken = lexer.peek()

    lexer.ignoreWhiteSpace = false

    if (cb) {
      const result = cb(tok, { column: lexer.col, line: lexer.line })

      if (result !== null) {
        highlightedSource += result

        continue
      }
    }

    if (type === 'left_brack') blockLevel ++;

    if (type === 'right_brack') blockLevel --;

    switch(type) {
      case 'let':
      case 'const':
        highlightedSource += purple.bold(value)
        break;
      case 'return':
      case 'while':
      case 'for':
      case 'break':
      case 'ternary':
      case 'if':
      case 'else':
        highlightedSource += purple.bold.italic(value)
        break;
      case 'function':
        highlightedSource += purple.bold.italic(value)
        break;
      case 'identifier':
        if (nextToken.type === 'left_paren') highlightedSource += brightblue(value)

        else if (prevToken && prevToken.type === 'dot') highlightedSource += cyan(value)

        else highlightedSource += white(value)

        break;
      case 'colon':
      case 'dot':
          highlightedSource += purple.bold(value)
          break;
      case 'assign':
      case 'plus_plus':
      case 'plus':
      case 'min':
      case 'mul':
      case 'div':
      case 'lt':
      case 'gt':
      case 'gt_eq':
      case 'lt_eq':
      case 'bin_and':
      case 'bin_or':
      case 'and':
      case 'or':
      case 'bang':
      case 'bang_bang':
      case 'typeof':
        highlightedSource += purple.bold(value)
        break;
      case 'left_paren':
      case 'right_paren':
      case 'left_brack':
      case 'right_brack':
      case 'left_curl_brace':
      case 'right_curl_brace':
        highlightedSource += brightYellow(value)
        break;
      case 'literal':
        switch (true) {
          case value.startsWith('"'):
          case value.startsWith("'"):
            highlightedSource += `${brightGreen(value[0])}${yellow(value.slice(1, value.length - 1))}${brightGreen(value[value.length - 1])}`
            break
          case value === 'false':
          case value === 'true':
          case value === 'null':
            highlightedSource += red(value)
            break
          default:
            highlightedSource += brightRed(value)
        }
        break;
      case 'comment':
        highlightedSource += gray(value)
        break;
      default:
        highlightedSource += white(value)
        break;
    }

    // if (error) {
    //   const lines = highlightedSource.split('\n')

    //   lines[lexer.line - 1] = styler.bgRed(lines[lexer.line - 1])

    //   highlightedSource = lines.join('\n')
    // }

    if (tok.type !== 'whitespace') prevToken = tok
  }


  return highlightedSource
}