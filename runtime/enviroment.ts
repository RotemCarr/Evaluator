import { MAKE_BOOL, MAKE_NULL, MAKE_NUMBER, RuntimeValue } from './values.ts'

export function createGlobalScope() {
  const enviroment = new Enviroment()

  enviroment.declareVar("null", MAKE_NULL(), true)
  enviroment.declareVar("true", MAKE_BOOL(true), true)
  enviroment.declareVar("false", MAKE_BOOL(false), true)
  enviroment.declareVar("pi", MAKE_NUMBER(3.14159), true)
  enviroment.declareVar("e", MAKE_NUMBER(2.71828), true)

  return enviroment
}

export default class Enviroment {
  private parent?: Enviroment
  private variables: Map<string, RuntimeValue>
  private constants: Set<string>

  constructor(parent?: Enviroment) {
    const global = parent ? true : false
    this.parent = parent
    this.variables = new Map()
    this.constants = new Set()


  }

  public declareVar(variableName: string, value: RuntimeValue, constant: boolean): RuntimeValue {
    if (this.variables.has(variableName)) {
      throw `Variable '${variableName}' is already declared.`
    }

    this.variables.set(variableName, value)
    if (constant) {
      this.constants.add(variableName)
    }
    return value
  }

  public assignVariable(variableName: string, value: RuntimeValue): RuntimeValue {
    const enviroment = this.resolve(variableName)
    if (enviroment.constants.has(variableName)) {
      throw `Cannot reassign value to ${variableName} because it is a constant.`
    }
    enviroment.variables.set(variableName, value)

    return value
  }

  public lookupVariable(variableName: string): RuntimeValue {
    const enviroment = this.resolve(variableName)
    return enviroment.variables.get(variableName) as RuntimeValue
  }

  public resolve(variableName: string): Enviroment {
    if (this.variables.has(variableName))
      return this

    if (this.parent == undefined)
      throw `Variable '${variableName}' cannot be resolved because it does not exist`

    return this.parent.resolve(variableName)
  }

}