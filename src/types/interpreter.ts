export type CompletionRecord = {
  type: 'NORMAL' | 'BREAK' | 'CONTINUE' | 'RETURN' | 'THROW',
  value?: any
  target?: string | null
}

export interface EnvironmentRecordInterface {
  outer: EnvironmentRecord | null
  get(name: string): any
  set(name: string, value: any): void
  createImmutableBinding(name: string, value: any): void
  createMutableBinding(name: string, value: any): void
  deleteBinding(name: string): boolean
}

export type EnvironmentVariables = Map<string, EnvironmentVariable>

export type EnvironmentVariable = {
  mutable: boolean
  value: any
}

export type EnvironmentRecord = EnvironmentRecordInterface

export type Scope = EnvironmentRecord | Record<string, any>

export type BinaryOperator = {
  precedence: number,
  assoc: 'left' | 'right'
  apply(lhs: any, rhs: any, env?: Scope): any
}

export type UnaryOperator = {
  (argument: any, env?: Scope): any
}