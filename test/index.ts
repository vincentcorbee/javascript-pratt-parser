import { readFileSync } from "node:fs"
import { compile } from "../src/compile"
import { EnvironmentRecord } from "../src/environment-record"
import { interpret } from "../src/interpret"
import path from "node:path"

const result = readFileSync(path.resolve(process.cwd(), 'source.ts'))

const src = result.toString()

const env = new EnvironmentRecord()

env.createImmutableBinding('console', console)

try {
  const ast = compile(src, true)

  const result = interpret(ast, env)

  console.log(result?.value)
}catch (error: any) {
  console.log(error.message)
}