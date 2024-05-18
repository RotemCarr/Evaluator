import Parser from './backend/parser'
import { createGlobalScope } from './runtime/enviroment'
import { evaluate } from './runtime/interpreter'
import { promises as fs } from 'node:fs'

async function readTextFile(filePath: string): Promise<string> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    if (error instanceof Error) {
        throw new Error(`Error reading file: ${error.message}`)
    } else {
        throw new Error('Unkown error occured')
    }
  }
}

//repl()
run("./test.txt")

async function run(source: string) {
    const parser = new Parser()
    const enviroment = createGlobalScope()

    const input = await readTextFile(source)
    const program = parser.produceAST(input)
    
    const result = evaluate(program, enviroment)
}

function repl() {
    const parser = new Parser()
    const enviroment = createGlobalScope()

    console.log("\nRepl v0.1")

    while (true) {
        const input = prompt("> ")

        if(!input || input.includes("exit")) {
            process.exit()
        }

        const program = parser.produceAST(input)
        const result = evaluate(program, enviroment)

        console.log(result)
        console.log('------------------------------------------------------------\n\n')
    }
}