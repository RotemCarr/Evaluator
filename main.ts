
import Parser from './backend/parser.ts'
import Enviroment from './runtime/enviroment.ts'
import { evaluate } from './runtime/interpreter.ts'
import { MAKE_BOOL, MAKE_NULL, /* MAKE_NUMBER */ } from './runtime/values.ts';

repl()

function repl() {
    const parser = new Parser()

    const enviroment = new Enviroment()
    enviroment.declareVar("true", MAKE_BOOL(true))
    enviroment.declareVar("false", MAKE_BOOL(false))
    enviroment.declareVar("null", MAKE_NULL())

    console.log("\nRepl v0.1")

    while (true) {
        const input = prompt("> ")

        if(!input || input.includes("exit")) {
            Deno.exit()
        }

        const program = parser.produceAST(input)
        console.log(program)

        const result = evaluate(program, enviroment)
        console.log(result)
        console.log('------------------------------------------------------------\n\n')
    }
}