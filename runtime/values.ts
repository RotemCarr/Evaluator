export type ValueType = 
| "null" 
| "boolean"
| "number"

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