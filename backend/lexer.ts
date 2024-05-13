export enum TokenType {
    //Literal types
    Number,
    Identifier,
    String,
    //Keywords
    Let,

    //Operators
    Equals,
    LeftParentheses,
    RightParentheses,
    Operator,
    EOF, //End Of File
}

const KEYWORDS: Record<string, TokenType> = {
    let: TokenType.Let,
}

export interface Token {
    value: string,
    type: TokenType,
}

function token(value = "", type: TokenType): Token {
    return { value, type }
}

function isAlpha(str: string) {
    return str.toUpperCase() != str.toLowerCase()
}

function isInt(str: string) {
    const c = str.charCodeAt(0)
    const bounds = ['0'.charCodeAt(0), '9'.charCodeAt(0)]
    return (c >= bounds[0] && c <= bounds[1])
}

function isSkippable(str: string) {
    return (str == ' ' || str == '\n' || str == '\t')
}

export function tokenize(sourceCode: string): Token[] {
    const tokens = new Array<Token>()
    const src = sourceCode.split("")

    while (src.length > 0) {
        if (src[0] == "(") {
            tokens.push(token(src.shift(), TokenType.LeftParentheses))
        } else if (src[0] == ")") {
            tokens.push(token(src.shift(), TokenType.RightParentheses))
        } else if (src[0] == "+" || src[0] == "-" || src[0] == "*" || src[0] == "/" || src[0] == "%") {
            tokens.push(token(src.shift(), TokenType.Operator))
        } else if (src[0] == "=") {
            tokens.push(token(src.shift(), TokenType.Equals))
        } else {
            if (isInt(src[0])) {
                let num = ""
                while (src.length > 0 && isInt(src[0])) {
                    num += src.shift()
                }

                tokens.push(token(num, TokenType.Number))
            } else if (isAlpha(src[0])) {
                let identifier = ""
                while (src.length > 0 && isAlpha(src[0])) {
                    identifier += src.shift()
                }

                const reserved = KEYWORDS[identifier]
                if (typeof reserved == "number") {
                    tokens.push(token(identifier,reserved))
                } else {
                    tokens.push(token(identifier, TokenType.Identifier))
                }
            } else if (isSkippable(src[0])) {
                src.shift()
            } else {
                console.log('Unrecognized charcter found in source:', src[0])
                Deno.exit()
            }
        }
    }

    tokens.push({type: TokenType.EOF, value: "EOF"})
    return tokens
}