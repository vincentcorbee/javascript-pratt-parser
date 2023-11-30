import { BinaryOperations, UnaryOperations } from "./operators"
import { EnvironmentRecord } from "./environment-record"
import { CompletionRecord, Expression, FunctionDeclaration, FunctionExpression, Program, Scope, Statement } from "./types"

function createFunction(node: FunctionExpression | FunctionDeclaration,  env: Scope): Function
{
  return function() {
    const scope = new EnvironmentRecord(env instanceof EnvironmentRecord ? env : null)

    node.params.forEach((param, i) => scope.createMutableBinding(param.name, arguments[i]))

    return interpret(node.body, scope)?.value
  }
}

function isIterable(value: any)
{
  return typeof value[Symbol.iterator] === 'function';
}

export function interpret(node: Program | Statement | Expression, env: Scope = new EnvironmentRecord()): CompletionRecord | undefined
{
  switch (node.type) {
    case 'break_stmt':
      return {
        type: 'BREAK',
        target: node.label?.name
      }
    case 'prog':
    {
      let result

      for (const stmt of node.body) result = interpret(stmt, env)

      return result
    }
    case 'block_stmt':
    {
      let value: CompletionRecord | undefined

      for (const stmt of node.body) {
        value = interpret(stmt, env)

        if (value && value.type === 'BREAK') return value
      }

      return {
        type: 'NORMAL',
        value: value?.value
      }
    }
    case 'return_stmt':
      return {
        type: 'RETURN',
        value: node.argument ? interpret(node.argument, env)?.value : undefined
      }
    case 'exp_stmt':
      return {
        type: 'NORMAL',
        value: interpret(node.expression, env)?.value
      }
    case "for_of_stmt":
      {
        const scope = new EnvironmentRecord(env as EnvironmentRecord)

        const { kind } = node.left

        const [ { id: { name } }] = node.left.declarations

        const right = interpret(node.right, env)

        if (!right || !isIterable(right.value)) throw TypeError(`TypeError: ${right?.value} is not iterable`)

        const { value } = right

        const iterator = value[Symbol.iterator]()

        let result

        do {
          const next = iterator.next()

          if (next.done) break;

          scope[kind === 'const' ? 'createImmutableBinding' : 'createMutableBinding'](name, next.value);

          result = interpret(node.body, scope)

          scope.deleteBinding(name)

          if (result?.type === 'BREAK') break

          if (result?.type === 'CONTINUE') continue
        } while(true)

        return {
          type: 'NORMAL',
          value: result?.value
        }
      }
    case 'for_stmt':
    {
      const scope = new EnvironmentRecord(env as EnvironmentRecord)

      if (node.init) interpret(node.init, scope)

      do
      {
        const result = interpret(node.body, scope)

        if (result?.type === 'BREAK') break

        if (result?.type === 'CONTINUE') continue

        if (node.update) interpret(node.update, scope)
      }
      while(node.test ? interpret(node.test, scope)?.value : false)

      return {
        type: 'NORMAL'
      }
    }
    case 'while_stmt':
    {
      const scope = new EnvironmentRecord(env as EnvironmentRecord)

      while(interpret(node.test, scope)?.value)
      {
        const result = interpret(node.body, scope)

        if (result?.type === 'BREAK') break

        if (result?.type === 'CONTINUE') continue
      }

      return {
        type: 'NORMAL'
      }
    }
    case 'if_stmt':
      return {
        type: 'NORMAL',
         value: interpret(node.test, env)?.value ? interpret(node.consequent, env)?.value : node.alternate ? interpret(node.alternate, env)?.value : undefined
      }
    case 'binary_exp':
    {
      const op = BinaryOperations[node.operator]

      if (!op) throw Error(`Binary operator "${node.operator}" not supported`)

      return  {
        type: 'NORMAL',
        value: op(interpret(node.left, env)?.value, interpret(node.right, env)?.value, env)
      }
    }
    case 'update_exp':
    {
      switch(node.argument.type) {
        case 'identifier':
          return {
            type: 'NORMAL',
            value: env.set(node.argument.name, UnaryOperations[node.operator](env.get(node.argument.name)))
          }
        default: throw SyntaxError('SyntaxError: Invalid left-hand side in assignment')
      }
    }
    case 'unary_exp':
    {
      const op = UnaryOperations[node.operator]

      if (!op) throw Error(`Unary operator "${node.operator}" not supported`)

      return {
        type: 'NORMAL',
        value: op(interpret(node.argument, env)?.value, env)
      }
    }
    case 'identifier':
      return {
        type: 'NORMAL',
        value: env instanceof EnvironmentRecord ? env.get(node.name) : (env as any)[node.name]
      }
    case 'literal':
      return {
        type: 'NORMAL',
        value: node.value
      }
    case 'member_exp':
      return {
        type: 'NORMAL',
        value: interpret(node.property, interpret(node.object, env)?.value)?.value
      }
    case 'object_exp':
    {
      return {
        type: 'NORMAL',
        value: node.properties.reduce((acc: any, prop) => {

          let key: any

          if (prop.key.type === 'identifier') key = prop.key.name

          if (prop.key.type === 'literal') key = interpret(prop.key, env)?.value

          if (key) acc[key] = interpret(prop.value, env)?.value

          return acc
        } , {})
      }
    }
    case 'array_exp':
      return {
        type: 'NORMAL',
        value: node.elements.map(el => interpret(el, env)?.value)
      }
    case 'call_exp':
    {
      let name = ''

      if(node.callee.type === 'identifier') name = node.callee.name

      if(node.callee.type === 'member_exp') name = node.callee.property.name

      const fn = interpret(node.callee, env)?.value

      if (typeof fn !== 'function') throw TypeError(`TypeError: ${name} is not a function`)

      return  {
        type: 'NORMAL',
        value: fn.apply(env, node.arguments.map(arg => interpret(arg, env)?.value))
      }
    }
    case 'conditional_exp':
      return {
        type: 'NORMAL',
        value: interpret(node.test, env)?.value ? interpret(node.consequent, env)?.value : interpret(node.alternate, env)?.value
      }
    case 'var_decl':
    {
      const mutable = node.kind !== 'const'

      let value

      for (const decl of node.declarations) {
        value = interpret(decl, env)?.value

        if(mutable) env.createMutableBinding(decl.id.name, value)
        else env.createImmutableBinding(decl.id.name, value)
      }

      return {
        type: 'NORMAL',
        value
      }
    }
    case 'var_declr':
      return {
        type: 'NORMAL',
        value: node.init ? interpret(node.init, env)?.value : undefined
      }
    case 'assign_exp':
    {
      switch(node.left.type) {
        case 'identifier':
          return {
            type: 'NORMAL',
            value: env.set(node.left.name, interpret(node.right, env)?.value)
          }
        default: throw SyntaxError('SyntaxError: Invalid left-hand side in assignment')
      }
    }
    case 'func_exp':
    {
      const func = createFunction(node, env)

      return {
        type: 'NORMAL',
        value: func
      }
    }
    case 'func_decl':
    {
      const func = createFunction(node, env)

      return {
        type: 'NORMAL',
        value: env.createImmutableBinding(node.id?.name, func)
      }
    }
    default:
      // @ts-ignore
      throw SyntaxError(`SyntaxError: Unexpected node type ${node.type}`)
  }
}