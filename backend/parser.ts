import { Statement, Program, Expression, BinaryExpr, NumericLiteral, Identifier } from './ast.ts'
import { tokenize, Token, TokenType } from './lexer.ts'

export default class Parser {
    private tokens: Token[] = []

    private notEOF(): boolean {
        return this.tokens[0].type != TokenType.EOF
    }

    private at() {
        return this.tokens[0] as Token
    }

    private advance() {
        const prev = this.tokens.shift() as Token
        return prev
    }

    // deno-lint-ignore no-explicit-any
    private expect(type: TokenType, err: any) {
        const prev = this.tokens.shift() as Token
        if (!prev || prev.type != type) {
            console.error("Parser Error:\n", err,"and got:", prev.type, "instead\n - Expecting ", type)
            Deno.exit()
        }

        return prev
    }

    public produceAST(sourceCode: string): Program {
        this.tokens = tokenize(sourceCode)

        const program: Program = {
            kind: "Program",
            body: []
        }

        while (this.notEOF()) {
            program.body.push(this.parseStatement())
        }

        return program
    }

    private parseStatement(): Statement {
        return this.parseExpr()
    }

    private parseExpr(): Expression {
        return this.parseAdditiveExpr()
    }

    private parseAdditiveExpr(): Expression {
        let left = this.parseMultiplicativeExpr()

        while (this.at().value == '+' || this.at().value == '-') {
            const operator = this.advance().value
            const right = this.parseMultiplicativeExpr()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr
        }

        return left
    }

    private parseMultiplicativeExpr(): Expression {
        let left = this.parsePrimaryExpr()

        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
            const operator = this.advance().value
            const right = this.parsePrimaryExpr()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr
        }

        return left
    }

    private parsePrimaryExpr(): Expression {
        const token = this.at().type

        switch (token) {
            case TokenType.Identifier:
                return {
                     kind: "Identifier",
                     symbol: this.advance().value,
                } as Identifier

            case TokenType.Number:
                return {
                    kind: "NumericLiteral",
                    value: parseFloat(this.advance().value)
                } as NumericLiteral

            case TokenType.LeftParentheses: {
                this.advance()
                const value = this.parseExpr()
                this.expect(
                    TokenType.RightParentheses,
                    "Expected ')'"
                )
                return value
            }

            default:
                console.error("Unexpected token found during parsing: ", this.at())
                Deno.exit()
        }
    }
}

