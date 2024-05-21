import { FunctionDeclaration, Program, VariableDeclaration } from '../../backend/ast'
import Enviroment from '../enviroment'
import { evaluate } from '../interpreter'
import { RuntimeValue, MAKE_NULL, FunctionValue } from '../values'

export function evaluateProgram(program: Program, enviroment: Enviroment): RuntimeValue {
    let lastEvaluated: RuntimeValue = MAKE_NULL()

    for (const statment of program.body) {
        lastEvaluated = evaluate(statment, enviroment)
    }

    return lastEvaluated
}

export function evalauteVariableDeclaration(declaration: VariableDeclaration, enviroment: Enviroment): RuntimeValue {
    const value = declaration.value ? evaluate(declaration.value, enviroment) : MAKE_NULL()
    return enviroment.declareVar(declaration.identifier, value, declaration.constant)
}

export function evaluateFunctionDeclaration(declaration: FunctionDeclaration, enviroment: Enviroment): RuntimeValue {
    const fn = {
        type: "function",
        name: declaration.name,
        parameters: declaration.paramaters,
        declarationScope: enviroment,
        body: declaration.body
    } as FunctionValue

    return enviroment.declareVar(declaration.name, fn, true)
}