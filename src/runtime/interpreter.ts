import { RuntimeValue, NumberValue } from './values'
import { AbsExpr, AssignmentExpr, BinaryExpr, CallExpr, FunctionDeclaration, Identifier, NumericLiteral, ObjectLiteral, Program, Statement, VariableDeclaration } from '../backend/ast'
import Enviroment from './enviroment';
import { evaluateIdentifier, evaluateBinaryExpr, evaluateAssignment, evaluateObjectExpression, evaluateAbsExpression, evaluateCallExpression } from './evaluate/expressions'
import { evalauteVariableDeclaration, evaluateFunctionDeclaration, evaluateProgram } from './evaluate/statments'

export function evaluate(astNode: Statement, enviroment: Enviroment): RuntimeValue {
    switch (astNode.kind) {
        case 'NumericLiteral':
            return {value: (astNode as NumericLiteral).value, type: "number"} as NumberValue

        case 'Identifier':
            return evaluateIdentifier(astNode as Identifier, enviroment)

        case 'ObjectLiteral':
            return evaluateObjectExpression(astNode as ObjectLiteral, enviroment)

        case 'CallExpr':
            return evaluateCallExpression(astNode as CallExpr, enviroment)

        case 'AbsExpr':
            return evaluateAbsExpression(astNode as AbsExpr, enviroment)

        case 'AssignmentExpr':
            return evaluateAssignment(astNode as AssignmentExpr, enviroment)

        case 'VariableDeclaration':
            return evalauteVariableDeclaration(astNode as VariableDeclaration, enviroment)

            case 'FunctionDeclaration':
                return evaluateFunctionDeclaration(astNode as FunctionDeclaration, enviroment)

        case 'BinaryExpr':
            return evaluateBinaryExpr(astNode as BinaryExpr, enviroment)

        case 'Program':
            return evaluateProgram(astNode as Program, enviroment)

        default:
            console.log("this AST Node is not interpretable:", astNode)
            process.exit()
    }
}