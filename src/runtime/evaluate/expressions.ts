import {
  AbsExpr,
  AssignmentExpr,
  BinaryExpr,
  CallExpr,
  Identifier,
  ObjectLiteral,
} from '../../backend/ast'
import Enviroment from '../enviroment'
import { evaluate } from '../interpreter'
import { FunctionValue, NativeFunctionValue } from '../values'
import {
  MAKE_NULL,
  NumberValue,
  ObjectValue,
  RuntimeValue,
} from '../values'

function evaluateNumericBinaryExpr(
  leftHandSide: NumberValue,
  rightHandSide: NumberValue,
  operator: string,
): NumberValue {
  let result = 0;
  if (operator == "+") {
    result = leftHandSide.value + rightHandSide.value;
  } else if (operator == "-") {
    result = leftHandSide.value - rightHandSide.value;
  } else if (operator == "*") {
    result = leftHandSide.value * rightHandSide.value;
  } else if (operator == "/") { //TODO: handle divison by 0
    result = leftHandSide.value / rightHandSide.value;
  } else if (operator == "%") {
    result = leftHandSide.value % rightHandSide.value;
  }

  return { value: result, type: "number" } as NumberValue;
}

export function evaluateBinaryExpr(
  binaryOperation: BinaryExpr,
  enviroment: Enviroment,
): RuntimeValue {
  const leftHandSide = evaluate(binaryOperation.left, enviroment);
  const rightHandSide = evaluate(binaryOperation.right, enviroment);

  if (leftHandSide.type == "number" && rightHandSide.type == "number") {
    return evaluateNumericBinaryExpr(
      leftHandSide as NumberValue,
      rightHandSide as NumberValue,
      binaryOperation.operator,
    );
  }

  return MAKE_NULL();
}

export function evaluateAbsExpression(
  abs: AbsExpr,
  enviroment: Enviroment,
): RuntimeValue {
  const absValue = evaluate(abs.value, enviroment) as NumberValue;

  if (absValue.value < 0) {
    return { type: "number", value: -(absValue.value) } as RuntimeValue;
  }

  return { type: "number", value: absValue.value } as RuntimeValue;
}

export function evaluateIdentifier(
  identifier: Identifier,
  enviroment: Enviroment,
): RuntimeValue {
  const value = enviroment.lookupVariable(identifier.symbol);
  return value;
}

export function evaluateAssignment(
  node: AssignmentExpr,
  enviroment: Enviroment,
): RuntimeValue {
  if (node.assigned.kind !== "Identifier") {
    throw `Invalid variable identifier: ${JSON.stringify(node.assigned)}`;
  }

  const variableName = (node.assigned as Identifier).symbol;
  return enviroment.assignVariable(
    variableName,
    evaluate(node.value, enviroment),
  );
}

export function evaluateObjectExpression(
  object: ObjectLiteral,
  enviroment: Enviroment,
): RuntimeValue {
  const obj = { type: "object", properties: new Map() } as ObjectValue;

  for (const { key, value } of object.properties) {
    const runtimeValue = (value == undefined)
      ? enviroment.lookupVariable(key)
      : evaluate(value, enviroment);

    obj.properties.set(key, runtimeValue);
  }

  return obj;
}

export function evaluateCallExpression(
  expression: CallExpr,
  enviroment: Enviroment,
): RuntimeValue {
  const args = expression.arguments.map((arg) => evaluate(arg, enviroment));
  const fn = evaluate(expression.caller, enviroment);

  if (fn.type == "nativeFunction") {
    const result = (fn as NativeFunctionValue).call(args, enviroment);
    return result;
  }

  if (fn.type == "function") {
    const func = fn as FunctionValue;
    const scope = new Enviroment(func.declarationScope);

    for (let i = 0; i < func.parameters.length; i++) {
      const variableName = func.parameters[i];
      scope.declareVar(variableName, args[i], false);
    }

    let result: RuntimeValue = MAKE_NULL();
    for (const statment of func.body) {
      result = evaluate(statment, scope);
    }

    return result;
  }

  throw "Cannot find function" + JSON.stringify(fn);
}
