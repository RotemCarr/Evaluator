import { BinaryExpr, Identifier } from '../../backend/ast.ts'
import Enviroment from '../enviroment.ts'
import { evaluate } from '../interpreter.ts'
import { NumberValue, RuntimeValue, MAKE_NULL } from '../values.ts'

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

export function evaluateBinaryExpr(binaryOperation: BinaryExpr, enviroment: Enviroment): RuntimeValue {
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

export function evaluateIdentifier(identifier: Identifier, enviroment: Enviroment): RuntimeValue {
    const value = enviroment.lookupVariable(identifier.symbol)
    return value
}