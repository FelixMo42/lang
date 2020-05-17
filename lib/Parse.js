const Token = (type, body, next) => ({type, body, next})
const TokenStream = (tokens, i=0) =>
    tokens.length === i ? EOF : Token(...tokens[i], TokenStream(tokens, i + 1))

const IsError = token => token.type === ERROR
const IsRequired = (type, rule) => type.rule != rule

const Error = (body, next) => Token(ERROR, body, next)
const Unexpected = token => Error(`unexpected ${token.type.name}`, token)
const Exprected = (type, token) => Error(`expected ${type.name}, got ${token.type.name}`, token)

const HandleError = (type, rule, body, error) => {
    if ( IsRequired(type, rule, body) ) {
        console.log(rule)

        console.error(`✗: ${error.body}`)

        if (error.next === EOF) return error

        return EatRule(type, rule, body, error.next.next)
    }

    return error
}

const EatRule = (type, rule, body, token) => {
    for (let [step, next] of rule) {
        let result = Eat(step, token)
        
        if ( IsError( result ) ) {
            // if (!rule.final && rule.length === 1) return HandleError(type, next, body, result)

            continue
        }
        
        if ( step.include ) body.push( result.body )

        return EatRule(type, next, body, result.next)
    }

    if ( rule.final != false ) return Token(type, rule.final(body), token)

    return HandleError(type, rule, body, Unexpected(token))
}

const Eat = (type, token) => {
    if ( typeof type == "string" ) {
        if ( token.body == type ) return token

        return Unexpected(token)
    }

    if ( token.type === type ) return token

    if ( type.isWord ) return Exprected(type, token)

    return EatRule(type, type.rule, [], token)
}

module.exports = (type, tokens) => Eat(type, TokenStream(tokens)).body

const EOF = Token(Symbol("end of file"))
const ERROR = Symbol("error")

///////////////////////////////////////////////////////////////////////////////////////

module.exports = (type, tokens) => {
    function Eat(type, index) {
        if ( index >= tokens.length ) return [ ERROR, index ]

        if ( typeof type == "string" )
            return tokens[index][1][0] == type ? [ tokens[index][1], index + 1 ] : [ ERROR, index ]

        if ( tokens[index][0] === type ) return [ tokens[index][1], index + 1 ]

        if ( type.isWord ) return [ ERROR, index ]

        return EatRule(type, index)
    }

    function EatRule(type, rule, index) {
        let body = []
        let rule = type.rule

        outer:
        while (true) {
            for (let [step, next] of rule) {
                let result = Eat(step, index)
                
                if ( result[0] === ERROR ) continue
                
                if ( step.include ) body.push( result[0] )

                rule = next

                continue outer
            }

            if ( rule.final !== false ) return [ body, index ]

            return [ ERROR, index + 1 ]
        }
    }

    return Eat(type, 0)[0]
}