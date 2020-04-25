const Desc = type => type.description
const Info = token => token.type.description

const Token = (type, body, next) => ({type, body, next})
const Error = (body, next) => Token(ERROR, body, next)

const TokenStream = (tokens, i=0) =>
    tokens.length == i ? EOF : Token(...tokens[i], TokenStream(tokens, i + 1))

const IsError = token => token.type == ERROR

const IsRequired = (rule, body) => body.length > 0

const EatRule = (rules, type, rule, body, token) => {
    for (let [step, next] of rule) {
        let result = Eat(rules, step, token)
        
        if ( IsError( result ) ) {
                 if ( rule.length == 1 && IsRequired(rule, body) ) console.log( rule.body )
            else if ( rule.length == 1 && !rule.final ) return result
            else continue
        }
        
        body.push( result.body )

        return EatRule(rules, type, next, body, result.next)
    }

    if ( rule.final || IsRequired(rule, body) ) return Token(type, body, token)

    console.log(rule, token.body, "\n")

    return Error(`✗: unexpected ${token.type.description}`, token)
}

const Eat = (rules, type, token) => {
    if (token.type == type) return token

    if ( !rules.has(type) ) return Error(`✗: exp ${Desc(type)}, got ${Info(token)}`, token.next)

    return EatRule(rules, type, rules.get(type), [], token)
}

module.exports = (rules, type, tokens) => Eat(rules, type, TokenStream(tokens)).body

const EOF = Token(Symbol("end of file"))
const ERROR = Symbol("error")