export type ASTNodeType =
    'binary_exp'
  | 'literal'
  | 'identifier'
  | 'call_exp'
  | 'member_exp'
  | 'assign_exp'
  | 'unary_exp'
  | 'conditional_exp'
  | 'update_exp'
  | 'exp_stmt'
  | 'block_stmt'
  | 'prog'
  | 'block_stmt'
  | 'return_stmt'
  | 'break_stmt'
  | 'for_stmt'
  | 'for_in_stmt'
  | 'for_of_stmt'
  | 'if_stmt'
  | 'var_decl'
  | 'var_declr'
  | 'func_decl'
  | 'func_exp'
  | 'object_exp'
  | 'array_exp'
  | 'property'
  | 'while_stmt'

export type VariableKind = 'let' | 'const'

export type SourceLocation = {
  source?: string | null;
  start: Position;
  end: Position;
}

export type Position = {
  line: number;
  column: number;
}

export type ASTNode = {
  type: ASTNodeType;
  loc?: SourceLocation | null;
}

export type Program = {
  type: "prog";
  body: Statement[];
} & ASTNode

export type BinaryExpression = {
  type: 'binary_exp'
  operator: string;
  left: Expression;
  right: Expression
} & ASTNode

export type UnaryExpression = {
  type: 'unary_exp';
  operator: string;
  argument: Expression;
} & ASTNode

export type CallExpression = {
  type: 'call_exp'
  callee: Expression
  arguments: Expression[]
} & ASTNode

export type MemberExpression = {
  type: 'member_exp'
  property: Identifier
  object: MemberExpression | Identifier
} & ASTNode

export type Literal = {
  type: 'literal'
  value: string | number | boolean | null | undefined
} & ASTNode

export type Identifier = {
  type: 'identifier'
  name: string
} & ASTNode

export type AssignmentExpression = {
  type: "assign_exp";
  operator: string;
  left: Identifier;
  right: Expression;
} & ASTNode

export type ConditionalExpression = {
  type: "conditional_exp";
  test: Expression;
  alternate: Expression;
  consequent: Expression;
} & ASTNode

export type ExpressionStatement = {
  type: "exp_stmt";
  expression: Expression;
} & ASTNode

export type BlockStatement = {
  type: "block_stmt";
  body: Statement[];
} & ASTNode

export type ForStatement = {
  type: "for_stmt";
  init: VariableDeclaration | Expression | null;
  test: Expression | null;
  update: Expression | null;
  body: Statement;
} & ASTNode

export type ForInStatement = {
  type: "for_in_stmt";
  left: VariableDeclaration;
  right: Expression;
  body: Statement;
} & ASTNode

export type ForOfStatement = Omit<ForInStatement, "type"> & { type: 'for_of_stmt' }

export type WhileStatement = {
  type: "while_stmt";
  test: Expression;
  body: Statement;
} & ASTNode

export type IfStatement = {
  type: 'if_stmt'
  test: Expression;
  consequent: Statement;
  alternate: Statement | null;
} & ASTNode

export type VariableDeclaration = {
  type: "var_decl"
  declarations: VariableDeclarator[];
  kind: VariableKind;
} & ASTNode

export type VariableStatement = VariableDeclaration

export type VariableDeclarator = {
  type: "var_declr";
  id: Identifier;
  init: Expression | null;
} & ASTNode

export type ObjectExpression = {
  type: "object_exp";
  properties: Property[];
} & ASTNode

export type ArrayExpression = {
  type: "array_exp";
  elements: Expression[];
} & ASTNode

export type Property = {
  type: "property";
  key: Literal | Identifier;
  value: Expression;
  kind: "init" | "get" | "set";
} & ASTNode

export type  Function = {
  id: Identifier | null;
  params: Identifier[];
  body: FunctionBody;
} & ASTNode

export type FunctionDeclaration = {
  type: "func_decl";
  id: Identifier;
} & Function

export type ReturnStatement = {
  type: "return_stmt";
  argument: Expression | null;
} & ASTNode

export type BreakStatement = {
  type: "break_stmt";
  label: Identifier | null;
} & ASTNode

export type FunctionExpression = {
  type: "func_exp";
} & Function

export type UpdateExpression = {
  type: "update_exp";
  operator: UpdateOperator;
  argument: Expression;
  prefix: boolean;
} & ASTNode

export type UpdateOperator = string

export type FunctionBody = BlockStatement

export type Statement =
    ExpressionStatement
  | BlockStatement
  | VariableDeclaration
  | VariableDeclarator
  | FunctionDeclaration
  | ReturnStatement
  | BreakStatement
  | ForStatement
  | ForInStatement
  | ForOfStatement
  | IfStatement
  | WhileStatement
  | VariableStatement

export type Expression =
    BinaryExpression
  | Literal
  | Identifier
  | CallExpression
  | MemberExpression
  | AssignmentExpression
  | ConditionalExpression
  | UnaryExpression
  | ObjectExpression
  | ArrayExpression
  | UpdateExpression
  | FunctionExpression
  | FunctionDeclaration
  | VariableDeclaration