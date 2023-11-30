import { PrattParser } from "./parser"

export function compile(src: string, printAst = false) {
  const parser = new PrattParser(src)
  const result = parser.parseProgram()

  if (printAst) console.dir({ result }, { depth: null })

  const nextToken = parser.lexer.peek()

  if(nextToken.type !== 'eof') parser.throwError(`Parsing error: unexpected token ${nextToken.value}`)

  return result
}