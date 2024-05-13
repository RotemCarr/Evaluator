import { RuntimeValue, NumberValue, MAKE_NULL } from './values.ts'
import { BinaryExpr, Identifier, NumericLiteral, Program, Statement } from '../backend/ast.ts'
import Enviroment from './enviroment.ts';

function evaluateProgram(program: Program, enviroment: Enviroment): RuntimeValue {
    let lastEvaluated: RuntimeValue = MAKE_NULL()

    for (const statment of program.body) {
        lastEvaluated = evaluate(statment, enviroment)
    }

    return lastEvaluated
}

function evaluateNumericBinaryExpr(
    leftHandSide: NumberValue,
    rightHandSide: NumberValue,
    operator: string): NumberValue {
        let result = 0
        if (operator == "+")
            result = leftHandSide.value + rightHandSide.value
        else if (operator == "-") 
            result = leftHandSide.value - rightHandSide.value
        else if (operator == "*")
            result = leftHandSide.value * rightHandSide.value
        else if (operator == "/") //TODO: handle divison by 0
            result = leftHandSide.value / rightHandSide.value
        else if (operator == "%")
            result = leftHandSide.value % rightHandSide.value

        return {value: result, type: "number"} as NumberValue
}

function evaluateBinaryExpr(binaryOperation: BinaryExpr, enviroment: Enviroment): RuntimeValue {
    const leftHandSide = evaluate(binaryOperation.left, enviroment)
    const rightHandSide = evaluate(binaryOperation.right, enviroment)

    if (leftHandSide.type == "number" && rightHandSide.type == "number") {
        return evaluateNumericBinaryExpr(
            leftHandSide as NumberValue,
            rightHandSide as NumberValue, 
            binaryOperation.operator)
    }

    return MAKE_NULL()
}

function evaluateIdentifier(identifier: Identifier, enviroment: Enviroment): RuntimeValue {
    const value = enviroment.lookupVariable(identifier.symbol)
    return value
}

export function evaluate(astNode: Statement, enviroment: Enviroment): RuntimeValue {
    switch (astNode.kind) {
        case 'NumericLiteral':
            return {value: (astNode as NumericLiteral).value, type: "number"} as NumberValue

        case 'Identifier':
            return evaluateIdentifier(astNode as Identifier, enviroment)

        case 'BinaryExpr':
            return evaluateBinaryExpr(astNode as BinaryExpr, enviroment)

        case 'Program':
            return evaluateProgram(astNode as Program, enviroment)

        default:
            console.log("this AST Node is not interpretable:", astNode)
            Deno.exit()
    }
}