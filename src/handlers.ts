import { ParseRules } from "./types"
import {
  blockStatement,
  variableDeclaration,
  literal,
  identifier,
  unaryExpression,
  parenthesizedExpression,
  assignmentExpression,
  conditionalExpression,
  binaryExpression,
  callExpression,
  memberExpression,
  objectExpression,
  functionDeclarationOrExpression,
  returnStatement,
  forStatement,
  variableStatement,
  updateExpression,
  breakStatement,
  ifStatement,
  arrayExpression,
  whileStatement,
} from "./parse-functions"

export const STD = {
  "left_curl_brace": {
    std: blockStatement
  },
  "let": {
    std: variableStatement
  },
  "const": {
    std: variableStatement
  },
  "return": {
    std: returnStatement
  },
  "break": {
    std: breakStatement
  },
  "for": {
    std: forStatement
  },
  "while": {
    std: whileStatement
  },
  "if": {
    std: ifStatement
  }
} as unknown as ParseRules

export const NUD = {
  "eof": {},
  "right_paren": {},
  "right_curl_brace": {},
  "right_brack": {},
  "comma": {},
  "semi": {},
  "else": {},
  "colon": {},
  "of": {},
  "let": {
    nud: variableDeclaration
  },
  "const": {
    nud: variableDeclaration
  },
  "function": {
    nud: functionDeclarationOrExpression
  },
  "false": {
    nud: literal
  },
  "null": {
    nud: literal
  },
  "true": {
    nud: literal
  },
  "literal": {
    nud: literal,
  },
  "identifier": {
    nud: identifier
  },
  "left_curl_brace": {
    lbp: 50,
    nud: objectExpression
  },
  "left_brack": {
    lbp: 50,
    nud: arrayExpression
  },
  "min": {
    lbp: 70,
    nud: unaryExpression,
  },
  "bang": {
    lbp: 70,
    nud: unaryExpression,
  },
  "plus_plus": {
    lbp: 70,
    nud: updateExpression
  },
  "left_paren": {
    lbp: 80,
    nud: parenthesizedExpression,
  },
} as unknown as ParseRules

export const LED = {
  "assign": {
    lbp: 10,
    led: assignmentExpression
  },
  "ternary": {
    lbp: 20,
    led: conditionalExpression,
  },
  "eq": {
    lbp: 40,
    led: binaryExpression,
  },
  "plus_plus": {
    lbp: 50,
    led: updateExpression
  },
  "gt": {
    lbp: 50,
    led: binaryExpression,
  },
  "lt": {
    lbp: 50,
    led: binaryExpression,
  },
  "gt_eq": {
    lbp: 50,
    led: binaryExpression,
  },
  "lt_eq": {
    lbp: 50,
    led: binaryExpression,
  },
  "and": {
    lbp: 50,
    led: binaryExpression,
  },
  "or": {
    lbp: 50,
    led: binaryExpression,
  },
  "bin_and": {
    lbp: 50,
    led: binaryExpression,
  },
  "bin_or": {
    lbp: 50,
    led: binaryExpression,
  },
  "plus": {
    lbp: 50,
    led: binaryExpression,
  },
  "mod": {
    lbp: 50,
    led: binaryExpression,
  },
  "min": {
    lbp: 50,
    led: binaryExpression,
  },
  "mul": {
    lbp: 60,
    led: binaryExpression,
  },
  "div": {
    lbp: 60,
    led: binaryExpression,
  },
  "left_paren": {
    lbp: 80,
    led: callExpression
  },
  "dot": {
    lbp: 80,
    led: memberExpression
  },
} as unknown as ParseRules