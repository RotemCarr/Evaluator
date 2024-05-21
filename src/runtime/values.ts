import { Statement } from '../backend/ast'
import Enviroment from './enviroment'

export type ValueType = 
| "null" 
| "boolean"
| "number"
| "object"
| "nativeFunction"
| "function"

export type FunctionCall = (args: RuntimeValue[], enviroment: Enviroment) => RuntimeValue

export interface RuntimeValue {
    type: ValueType
}

export interface NullValue extends RuntimeValue {
    type: "null",
    value: null,
}

export function MAKE_NULL() {
    return {type: "null", value: null} as NullValue
}

export interface BooleanValue extends RuntimeValue {
    type: "boolean",
    value: boolean
}

export function MAKE_BOOL(bool = true) {
    return {type: "boolean", value: bool} as BooleanValue
}

export interface NumberValue extends RuntimeValue {
    type: "number",
    value: number
}

export function MAKE_NUMBER(number = 0) {
    return {type: "number", value: number} as NumberValue
}

export interface ObjectValue extends RuntimeValue {
    type: "object",
    properties: Map<string, RuntimeValue>
}

export interface NativeFunctionValue extends RuntimeValue {
    type: "nativeFunction",
    call: FunctionCall
}

export function MAKE_NATIVE_FUNCTION(call: FunctionCall) {
    return {type: "nativeFunction", call} as NativeFunctionValue
}

export interface FunctionValue extends RuntimeValue {
    type: "function",
    name: string,
    parameters: string[],
    declarationScope: Enviroment,
    body: Statement[]
}