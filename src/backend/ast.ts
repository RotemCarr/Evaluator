export type NodeType =
//Statements
| "Program"
| "VariableDeclaration"
| "FunctionDeclaration"
//Expressions
| "AssignmentExpr"
| "BinaryExpr" 
| "AbsExpr"
| "MemberExpr"
| "CallExpr"
//Literals
| "Property"
| "ObjectLiteral"
| "NumericLiteral"
| "Identifier" 


export interface Statement {
    kind: NodeType
}

export interface Program extends Statement {
    kind: "Program",
    body: Statement[]
}

export interface VariableDeclaration extends Statement {
    kind: "VariableDeclaration",
    constant: boolean,
    identifier: string,
    value?: Expression
}

export interface FunctionDeclaration extends Statement {
    kind: "FunctionDeclaration",
    paramaters: string[],
    name: string,
    body: Statement[]
}

export interface Expression extends Statement {}

export interface AssignmentExpr extends Expression {
    kind: "AssignmentExpr",
    assigned: Expression,
    value: Expression
}

export interface BinaryExpr extends Expression {
    kind: "BinaryExpr",
    left: Expression,
    right: Expression,
    operator: string
}

export interface Identifier extends Expression {
    kind: "Identifier",
    symbol: string
}

export interface NumericLiteral extends Expression {
    kind: "NumericLiteral",
    value: number
}

export interface Property extends Expression {
    kind: "Property",
    key: string,
    value?: Expression
}

export interface ObjectLiteral extends Expression {
    kind: "ObjectLiteral",
    properties: Property[]
}

export interface AbsExpr extends Expression {
    kind: "AbsExpr",
    value: Expression
}

export interface CallExpr extends Expression {
    kind: "CallExpr",
    arguments: Expression[],
    caller: Expression
}

export interface MemberExpr extends Expression {
    kind: "MemberExpr",
    object: ObjectLiteral,
    property: Property,
    computed: boolean
}