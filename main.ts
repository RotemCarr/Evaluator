
import Parser from './backend/parser.ts'
import Enviroment, { createGlobalScope } from './runtime/enviroment.ts'
import { evaluate } from './runtime/interpreter.ts'

//repl()
run("./test.txt")

async function run(source: string) {
    const parser = new Parser()
    const enviroment = createGlobalScope()

    const input = await Deno.readTextFile(source)
    const program = parser.produceAST(input)
    const result = evaluate(program, enviroment)
    console.log(result)
}

function repl() {
    const parser = new Parser()
    const enviroment = createGlobalScope()

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