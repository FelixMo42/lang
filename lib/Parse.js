const Token = (type, body, next) => ({type, body, next})
const Error = (body, next) => Token(ERROR, body, next)

const TokenStream = (tokens, i=0) =>
    tokens.length == i ? EOF : Token(...tokens[i], TokenStream(tokens, i + 1))

const IsError = token => token.type == ERROR

const IsRequired = (rule, body) => body.length > 0

const Unexpected = token => Error(`unexpected ${token.type.description}`, token)
const Exprected = (type, token) =>
    Error(`expected ${type.description}, got ${token.type.description}`, token)

const HandleError = (rules, type, rule, body, error) => {
    if ( IsRequired(rule, body) ) {
        console.error(`✗: ${error.body}`)

        // if ( rule.length == 1 ) return EatRule(rules, type, rule[0][1], body, error.next)
       
        let token = error.next

        if (token == EOF) return error

        return EatRule(rules, type, rule, body, token.next)
    }

    return error
}

const EatRule = (rules, type, rule, body, token) => {
    for (let [step, next] of rule) {
        let result = Eat(rules, step, token)
        
        if ( IsError( result ) ) {
            if (!rule.final && rule.length == 1) return HandleError(rules, type, next, body, result)

            continue
        }
        
        body.push( result.body )

        return EatRule(rules, type, next, body, result.next)
    }

    if ( rule.final ) return Token(type, body, token)

    return HandleError(rules, type, rule, body, Unexpected(token))
}

const Eat = (rules, type, token) => {
    if ( token.type == type ) return token

    if ( !rules.has(type) ) return Exprected(type, token)

    return EatRule(rules, type, rules.get(type), [], token)
}

module.exports = (rules, type, tokens) => Eat(rules, type, TokenStream(tokens)).body

const EOF = Token(Symbol("end of file"))
const ERROR = Symbol("error")