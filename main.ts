
import Parser from './backend/parser.ts'
import { evaluate } from './runtime/interpreter.ts'

repl()

function repl() {
    const parser = new Parser()
    console.log("\nRepl v0.1")

    while (true) {
        const input = prompt("> ")

        if(!input || input.includes("exit")) {
            Deno.exit()
        }

        const program = parser.produceAST(input)
        console.log(program)

        const result = evaluate(program)
        console.log(result)
        console.log('------------------------------------------------------------\n\n')
    }
}