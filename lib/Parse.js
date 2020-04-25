const Token = (type, body, next) => ({type, body, next})

const MakeError = (body, next) => Token(ERROR, body, next)

const TokenStream = (tokens, i=0) =>
    tokens.length == i ? EOF : Token(...tokens[i], TokenStream(tokens, i + 1))

const IsError = token => token.type == ERROR

const EatRule = (rules, type, rule, body, token) => {
    for (let [step, next] of rule) {
        let result = Eat(rules, step, token)
        
        if ( IsError( result ) ) continue

        body.push( result.body )

        return EatRule(rules, type, next, body, result.next)
    }

    if ( rule.final ) return Token(type, body, token)

    return MakeError(`✗: unexpected {}`, token)
}

const Eat = (rules, type, token) => {
    if (token.type == type) return token

    if ( !rules.has(type) ) return MakeError(`✗: expected {}, got {}`, token.next)

    return EatRule(rules, type, rules.get(type), [], token)
}

module.exports = (rules, type, tokens) => Eat(rules, type, TokenStream(tokens)).body

const EOF = Token(Symbol("EOF"))
const ERROR = Symbol("Error")