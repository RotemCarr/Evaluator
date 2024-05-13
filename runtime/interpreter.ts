import { RuntimeValue, NumberValue } from './values.ts'
import { BinaryExpr, Identifier, NumericLiteral, Program, Statement, VariableDeclaration } from '../backend/ast.ts'
import Enviroment from './enviroment.ts';
import { evaluateIdentifier, evaluateBinaryExpr } from './evaluate/expressions.ts';
import { evalauteVariableDeclaration, evaluateProgram } from './evaluate/statments.ts';

export function evaluate(astNode: Statement, enviroment: Enviroment): RuntimeValue {
    switch (astNode.kind) {
        case 'NumericLiteral':
            return {value: (astNode as NumericLiteral).value, type: "number"} as NumberValue

        case 'Identifier':
            return evaluateIdentifier(astNode as Identifier, enviroment)

        case 'VariableDeclaration':
            return evalauteVariableDeclaration(astNode as VariableDeclaration, enviroment)

        case 'BinaryExpr':
            return evaluateBinaryExpr(astNode as BinaryExpr, enviroment)

        case 'Program':
            return evaluateProgram(astNode as Program, enviroment)

        default:
            console.log("this AST Node is not interpretable:", astNode)
            Deno.exit()
    }
}