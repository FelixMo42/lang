const EOF     = Symbol("type#EOF")
const ERROR   = Symbol("type#ERROR")

const MakeToken = (type, body, next) =>
    ({type, body, next})

const MakeError = (body, next) =>
    MakeToken(ERROR, body, next)

const MakeTokenStream = (tokens, i=0) =>
    tokens.length == i ? MakeToken(EOF) :
        MakeToken( tokens[i][0], tokens[i][1], MakeTokenStream(tokens, i + 1) )

const IsError = token =>
    token.type == ERROR

const TokenStackToString = token =>
    token.type != EOF ? token.type.description + " " + TokenStackToString(token.next) : ""

const EatRule = (rules, type, rule, token) =>
    {
        let next = token
        let body = []

        for (let step of rule) {
            result = Eat(rules, step, next)

            if ( IsError(result) ) return MakeError(result, token)

            body.push(result.body)
            next = result.next
        }

        return MakeToken(type, rule.final(body), next)
    }

const Eat = (rules, type, token) =>
    {
        if (token.type == type) return token

        if ( !rules.has(type) ) return MakeError(
            `got token of type ${token.type.description}, expected ${type.description}`,
            token.next
        )

        for (let rule of rules.get(type)) {
            let result = EatRule(rules, type, rule, token)

            if ( !IsError(result) ) return result
        }

        return MakeError('foo', token)
    }

const Parse = module.exports = (rules, type, tokens) =>
    Eat(rules, type, MakeTokenStream(tokens)).body