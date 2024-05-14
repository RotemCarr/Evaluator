import { Statement, Program, Expression, BinaryExpr, NumericLiteral, Identifier, VariableDeclaration, AssignmentExpr } from './ast.ts'
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
        switch (this.at().type) {
            case TokenType.Let:
                return this.parseVariableDeclaration()

            case TokenType.Const:
                return this.parseVariableDeclaration()

            default:
                return this.parseExpression()
        }
    }

    private parseVariableDeclaration(): Statement {
        const isConstant = this.advance().type == TokenType.Const
        const identifier = this.expect(
            TokenType.Identifier,
            "Expected identifier name after 'let' | 'const'"
        ).value

        if (this.at().type == TokenType.Semicolon) {
            this.advance()
            if (isConstant) {
                throw "Cannot declare a constant without initializing it."
            }
            return {
                kind: "VariableDeclaration",
                identifier,
                constant: false,
            } as VariableDeclaration
        }

        this.expect(TokenType.Equals, "Expected '=' after identifier.")

        const declaration = {
            kind: "VariableDeclaration", 
            value: this.parseExpression(),
            identifier,
            constant: isConstant,
        } as VariableDeclaration

        //this.expect(TokenType.Semicolon, "Expected ';'")
        if (this.at().type == TokenType.Semicolon) {
            this.advance()
        }
        
        return declaration
    }

    private parseExpression(): Expression {
        return this.parseAssignmentExpression()
    }

    private parseAssignmentExpression(): Expression {
        const left = this.parseAdditiveExpression()

        if (this.at().type == TokenType.Equals) {
            this.advance()
            const value = this.parseAssignmentExpression()
            return {value, assigned: left, kind: "AssignmentExpr"} as AssignmentExpr
        }

        return left
    }

    private parseAdditiveExpression(): Expression {
        let left = this.parseMultiplicativeExpression()

        while (this.at().value == '+' || this.at().value == '-') {
            const operator = this.advance().value
            const right = this.parseMultiplicativeExpression()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator,
            } as BinaryExpr
        }

        return left
    }

    private parseMultiplicativeExpression(): Expression {
        let left = this.parsePrimaryExpression()

        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
            const operator = this.advance().value
            const right = this.parsePrimaryExpression()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr
        }

        return left
    }

    private parsePrimaryExpression(): Expression {
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
                const value = this.parseExpression()
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

