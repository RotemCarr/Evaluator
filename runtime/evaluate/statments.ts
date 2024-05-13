import { Program, VariableDeclaration } from '../../backend/ast.ts'
import Enviroment from '../enviroment.ts'
import { evaluate } from '../interpreter.ts'
import { RuntimeValue, MAKE_NULL } from '../values.ts'

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