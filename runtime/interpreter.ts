import { RuntimeValue, NumberValue, NullValue } from './values.ts'
import { BinaryExpr, NumericLiteral, Program, Statement } from '../frontend/ast.ts'

function evaluateProgram(program: Program): RuntimeValue {
    let lastEvaluated: RuntimeValue = {type: "null", value: "null"} as NullValue

    for (const statment of program.body) {
        lastEvaluated = evaluate(statment)
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

function evaluateBinaryExpr(binaryOperation: BinaryExpr): RuntimeValue {
    const leftHandSide = evaluate(binaryOperation.left)
    const rightHandSide = evaluate(binaryOperation.right)

    if (leftHandSide.type == "number" && rightHandSide.type == "number") {
        return evaluateNumericBinaryExpr(
            leftHandSide as NumberValue,
            rightHandSide as NumberValue, 
            binaryOperation.operator)
    }

    return {type: "null", value: "null"} as NullValue
}

export function evaluate(astNode: Statement): RuntimeValue {
    switch (astNode.kind) {
        case 'NumericLiteral':
            return {value: (astNode as NumericLiteral).value, type: "number"} as NumberValue

        case 'NullLiteral':
            return {value: "null", type: "null"} as NullValue

        case 'BinaryExpr':
            return evaluateBinaryExpr(astNode as BinaryExpr)

        case 'Program':
            return evaluateProgram(astNode as Program)

        default:
            console.log("this AST Node is not interpretable:", astNode)
            Deno.exit()
    }
}