import { interpret } from './interpret';
import { compile } from './compile';
import { EnvironmentRecord } from './environment-record';
import { styler } from '@digitalbranch/styler';
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import path from 'node:path';
import { highlight } from './highlight';

const env = new EnvironmentRecord(null, { console: { value: console, mutable: false } })

const historyFileName = '.repl_history'

function quit(process: NodeJS.Process, output: NodeJS.WriteStream) {
  output.write(styler.bold.blue('\nBye!\n'))

  return process.exit(0)
}

function loadHistory(process: NodeJS.Process): string[]
{
  const location = path.resolve(process.env.HOME ?? '', historyFileName)

  if (!existsSync(location)) return []

  const file = readFileSync(location)

  return file.toString().split('\n').filter(Boolean)
}

function saveHistory(process: NodeJS.Process, history: string[]): void
{
  const location = path.resolve(process.env.HOME ?? '', historyFileName)

  writeFileSync(location, history.join('\n'))
}

function showHelp(output: NodeJS.WriteStream)
{
  output.write(`
  .break    Break out of current (multiline) expression or use ${styler.yellow.bold('ctrl + c')}.
  .exit     Exit the REPL.
  .help     Print this help message.
  .load     Load a file into the REPL session.
  .save     Save all evaluated commands in this REPL session to a file.

  Press ${styler.yellow.bold('ctrl + c')} to abort current expression, ${styler.yellow.bold('ctrl + d')} to exit the REPL.
  `)
}

const prompt = '$'

const input = process.stdin

const output = process.stdout

let lines: string[] = []

const history: string[] = loadHistory(process)

output.write(`\n${styler.blue.bold('Welcome')}\n\n`)

output.write(`Type ${styler.yellow.bold('.help')} for more information.\n\n`)

output.write(`${prompt} `)

input.setRawMode(true)

let column = 0

let historyEntry = history.length || 1

let line: string = ''

let CSIDirCode = ''

let ctrlCPressed = false

let isMultiline = false

let multiline = ''

let leftBraces: string[] = []

let rightBraces: string[] = []

input.on('data', (data: Buffer) => {
  const token = data.toString()

  switch(token) {
    /* Up */
    case '\x1B[A':
    {
      if (history.length === 0) break

      historyEntry = Math.max(-1, historyEntry - 1)

      line = history[historyEntry] ?? ''

      column = line.length

      break
    }
    /* Down */
    case '\x1B[B':
    {
      if (history.length === 0) break

      historyEntry = Math.min(history.length, historyEntry + 1)

      line = history[historyEntry] ?? ''

      column = line.length

      break
    }
    /* Forward */
    case '\x1B[C':
    {
      column = Math.min(line.length, column + 1)

      break;
    }
    /* Backward */
    case '\x1B[D':
    {
      column = Math.max(0, column - 1)

      break;
    }
    /* Newline */
    case '\n':
    /* Cariage return */
    case '\r':
    {
      output.write('\n')

      if (multiline) {
        if(line.startsWith('.break'))
        {
          isMultiline = false

          multiline = ''

          line = ''

          break;
        }

        leftBraces = leftBraces.concat(line.match(/{/g) ?? [])

        rightBraces = rightBraces.concat(line.match(/}/g) ?? [])

        multiline += `${' '.repeat(leftBraces.length - rightBraces.length)}${line}\n`

        if(!history.includes(line)) history.push(line)

        if (leftBraces.length === rightBraces.length) {
          line = multiline
        } else {
          line = ''

          break
        }
      } else {
        leftBraces = line.match(/{/g) ?? []

        if (leftBraces.length > 0) {
          rightBraces = line.match(/}/g) ?? []

          if (leftBraces.length !== rightBraces.length) {
            isMultiline = true

            output.write(`\r`)

            multiline += `${line}\n`

            if(!history.includes(line)) history.push(line)

            line = ''

            break
          }
        }
      }

      switch(true) {
        case line.includes('.exit'): return quit(process, output)
        case line.startsWith('.load'):
        {
          const match = line.match(/\.load +([^ ]+)/)

          if (match) {
            const filePath = match[1]

            try {
              const contents = readFileSync(path.resolve(filePath)).toString()

              lines = contents.split('\n')

              try {
                const result = interpret(compile(contents), env)?.value

                console.log(result)
              } catch(error: any) {
                output.write(`${error.message}\n`)
              }
            } catch (error: any) {
              output.write(`Failed to load: ${styler.red.bold(filePath)}\n`)
            }
          } else {
            output.write(`No file path provided\n`)
          }

          if(!history.includes(line)) history.push(line)

          break;
        }
        case line.startsWith('.save'):
        {
          const match = line.match(/\.save +([^ ]+)/)

          if (match) {
            const filePath = match[1]

            try {
              writeFileSync(path.resolve(filePath), lines.join('\n'))

              output.write(`Session save to: ${styler.green.bold(filePath)}\n`)
            } catch (error: any) {
              output.write(`Failed to save: ${styler.red.bold(filePath)}\n`)
            }
          } else {
            output.write(`No file path provided\n`)
          }

          if(!history.includes(line)) history.push(line)

          break;
        }
        case line.startsWith('.help'):
        {
          showHelp(output)

          if(!history.includes(line)) history.push(line)

          break;
        }
        default:
        {
          try {
            const result = interpret(compile(line), env)?.value

            console.log(result)

            if(!multiline && !history.includes(line)) history.push(line)

            lines.push(line)

            historyEntry = history.length
          } catch (error: any){
            output.write(`${error.message}\n`)
          }

          multiline = ''

          isMultiline = false
        }
      }

      line = ''

      // output.write(prompt)

      break;
    }
    /* Ctrl + a -> move cursor to begining of line */
    case '\x01':
    {
      column = 0;

      break
    }
    /* Ctrl + c */
    case '\x03':
    {
      if (ctrlCPressed) {
        saveHistory(process, history)

        return quit(process, output)
      }

      output.write(`\x1b[2K\x1b[0G(To exit, press ${styler.bold.yellow('Ctrl + C')} again or ${styler.bold.yellow('Ctrl + D')} or type ${styler.bold.yellow('.exit')})\n`)

      ctrlCPressed = true

      multiline = ''

      isMultiline = false

      line = ''

      break;
    }
    /* Ctrl + d */
    case '\x04':
    {
      saveHistory(process, history)

      return quit(process, output)
    }
    /* Ctrl + e -> move cursor to end of liner */
    case '\x05':
    {
      column = line.length;

      break
    }
    /* Ctrl + k -> erase line to the right of cursor */
    case `\x0B`:
    {
      line = line.slice(0, column)

      break;
    }
    /* Ctrl + u -> erase line to the left of cursor */
    case `\x15`:
    {
      line = line.slice(column)

      column = 0

      break;
    }
    /* Backspace -> erase character */
    case '\x7F':
    {
      column = Math.max(0, column - 1)

      const output = line.split('')

      output.splice(column, 1)

      line = output.join('')

      break;
    }
    /* Other character */
    default:
    {
      if (column !== line.length) {

        const output = line.split('')

        output.splice(column, 0, token)

        line = output.join('')
      } else {
        line += token
      }

      column = Math.min(line.length, column + 1)

      ctrlCPressed = false

      historyEntry = history.length

      break;
    }
  }

  const { length } = line

  CSIDirCode = length === column ? '' : `\x1B[${length - column}D`;

  output.write(`\x1b[2K\x1b[0G${ isMultiline ? styler.gray('...') : prompt} ${highlight(line)}${CSIDirCode}`)
})