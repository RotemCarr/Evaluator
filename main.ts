
import Parser from './backend/parser.ts'
import Enviroment from './runtime/enviroment.ts'
import { evaluate } from './runtime/interpreter.ts'
import { MAKE_BOOL, MAKE_NULL, MAKE_NUMBER, /* MAKE_NUMBER */ } from './runtime/values.ts';

repl()

function repl() {
    const parser = new Parser()

    const enviroment = new Enviroment()
    enviroment.declareVar("pi", MAKE_NUMBER(3.14159), true)
    enviroment.declareVar("e", MAKE_NUMBER(2.71828), true)
    enviroment.declareVar("true", MAKE_BOOL(true), true)
    enviroment.declareVar("false", MAKE_BOOL(false), true)
    enviroment.declareVar("null", MAKE_NULL(), true)

    console.log("\nRepl v0.1")

    while (true) {
        const input = prompt("> ")

        if(!input || input.includes("exit")) {
            Deno.exit()
        }

        const program = parser.produceAST(input)
        const result = evaluate(program, enviroment)

        console.log(result)
        console.log('------------------------------------------------------------\n\n')
    }
}