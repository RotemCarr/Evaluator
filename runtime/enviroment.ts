import { RuntimeValue } from "./values.ts";

export default class Enviroment {
  private parent?: Enviroment
  private variables: Map<string, RuntimeValue>

  constructor(parent?: Enviroment) {
    this.parent = parent
    this.variables = new Map()
  }

  public declareVar(variableName: string, value: RuntimeValue): RuntimeValue {
    if (this.variables.has(variableName)) {
      throw `Variable '${variableName}' is already declared.`
    }

    this.variables.set(variableName, value)
    return value
  }

  public assignVariable(variableName: string, value: RuntimeValue): RuntimeValue {
    const enviroment = this.resolve(variableName)
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