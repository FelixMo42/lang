const Token = (type, body, next) => ({type, body, next})

const MakeError = (body, next) => Token(ERROR, body, next)

const TokenStream = (toks, i=0) => toks.length == i ? EOF : Token(toks[i][0], toks[i][1], TokenStream(toks, i + 1))

const IsError = token => token.type == ERROR

const IsRequired = (rule, i) => i > rule.ambiguous

const EatRule = (rules, type, rule, token) => {
    let next = token
    let body = []

    for (let i = 0; i < rule.length; i++) {
        let step = rule[i]

        result = Eat(rules, step, next)

        if ( IsError(result) ) {
            if ( !IsRequired(rule, i) ) {
                return MakeError(result, token)
            }

            console.log( result.body )
        }

        body.push(result.body)
        next = result.next
    }

    return Token(type, rule.final(body), next)
}

const Eat = (rules, type, token) => {
    if (token.type == type) return token

    if ( !rules.has(type) ) return MakeError(
        `got token of type ${token.type.description}, expected ${type.description}`,
        token.next
    )

    for (let rule of rules.get(type)) {
        let result = EatRule(rules, type, rule, token)

        if ( !IsError(result) ) return result
    }

    return MakeError(`unexpected token "${token.body}" of type ${token.type.description}`, token)
}

const Parse = module.exports = (rules, type, tokens) => Eat(rules, type, TokenStream(tokens)).body

const EOF   = Token(Symbol("EOF"))
const ERROR = Symbol("Error")