import { Statement, Program, Expression, BinaryExpr, NumericLiteral, Identifier, VariableDeclaration, AssignmentExpr, Property, ObjectLiteral, AbsExpr, CallExpr, MemberExpr } from './ast.ts'
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
        const left = this.parseObjectExpression()

        if (this.at().type == TokenType.Equals) {
            this.advance()
            const value = this.parseAssignmentExpression()
            return {value, assigned: left, kind: "AssignmentExpr"} as AssignmentExpr
        }

        return left
    }

    private parseObjectExpression(): Expression {
        if(this.at().type !== TokenType.LeftBrace) {
            return this.parseAdditiveExpression()
        }

        this.advance()
        const properties = new Array<Property>()

        while (this.notEOF() && this.at().type !== TokenType.RightBrace) {
            const key = this.expect(TokenType.Identifier, "Expected object key.").value

            if (this.at().type == TokenType.Comma) {
                this.advance()
                properties.push({key, kind: "Property"})
                continue
            } else if (this.at().type == TokenType.RightBrace) {
                properties.push({key, kind: "Property"})
            }

            this.expect(TokenType.Colon, "Expected ':'")
            const value = this.parseExpression()

            properties.push({key, kind: "Property", value})
            if (this.at().type !== TokenType.RightBrace) {
                this.expect(TokenType.Comma, "Expected ',' or '}'")
            }
        }

        this.expect(TokenType.RightBrace, "Expected '}'")
        return {kind: "ObjectLiteral", properties} as ObjectLiteral 
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
        let left = this.parseCallMemberExpression()

        while (this.at().value == "*" || this.at().value == "/" || this.at().value == "%") {
            const operator = this.advance().value
            const right = this.parseCallMemberExpression()
            left = {
                kind: "BinaryExpr",
                left,
                right,
                operator
            } as BinaryExpr
        }

        return left
    }

    private parseCallMemberExpression(): Expression {
       const member = this.parseMemberExpression()

       if (this.at().type == TokenType.LeftParentheses) {
        return this.parseCallExpression(member)
       }

       return member
    }

    private parseCallExpression(caller: Expression): Expression {
        let callExpression: Expression = {
            kind: "CallExpr",
            caller,
            arguments: this.parseArguments(),
        } as CallExpr

        if (this.at().type == TokenType.LeftParentheses) {
            callExpression = this.parseCallExpression(callExpression)
        }

        return callExpression
    }

    private parseArguments(): Expression[] {
        this.expect(TokenType.LeftParentheses, "Expected '('")
        const args = this.at().type == TokenType.RightParentheses ? [] : this.parseArgumentsList()

        this.expect(TokenType.RightParentheses, "Expected ')'")
        return args
    }

    private parseArgumentsList(): Expression[] {
        const args = [this.parseAssignmentExpression()]

        while (this.notEOF() && this.at().type == TokenType.Dot && this.advance()) {
            args.push(this.parseAssignmentExpression())
        }

        return args
    }

    private parseMemberExpression(): Expression {
        let object = this.parsePrimaryExpression()

        while (this.at().type == TokenType.Dot || this.at().type == TokenType.LeftBracket) {
            const operator = this.advance()
            let property: Expression
            let computed: boolean

            if (operator.type == TokenType.Dot) {
                computed = false
                property = this.parsePrimaryExpression()

                if (property.kind !== "Identifier") {
                    throw `Expected identifier and found ${property.kind} instead.`
                }
            } else {
                computed = true
                property = this.parseExpression()
                this.expect(TokenType.RightBracket, "Expected ']'")
            }

            object = {
                kind: "MemberExpr", 
                object,
                property,
                computed,
            } as MemberExpr
        }

        return object
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

            case TokenType.Pipe: {
                this.advance()
                const value = this.parseExpression()
                this.expect(TokenType.Pipe, "Expected '|'")

                return {
                    kind: "AbsExpr",
                    value
                } as AbsExpr
            }

            default:
                console.error("Unexpected token found during parsing: ", this.at())
                Deno.exit()
        }
    }
}

