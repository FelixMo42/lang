const EOF     = Symbol("type#EOF")
const ERROR   = Symbol("type#ERROR")

const MakeToken = (type, body, next) =>
    ({type, body, next})

const MakeError = (body, next) =>
    MakeToken(ERROR, body, next)

const MakeTokenStream = (tokens, i=0) =>
    tokens.length == i ? MakeToken(EOF) :
        MakeToken( tokens[i][0], tokens[i][1], MakeTokenStream(tokens, i + 1) )

const MakeRulesForType = (type, rules) =>
    [type, rules]

const MakeRule = (steps, final=(params) => params) =>
    {
        steps.final = final
        return steps
    }
    
const Lex = (types, file) =>
    MakeTokenStream(
        file.split(" ").map(token => {
            for (let [type, pattern] of types) {
                if ( token.match(pattern) ) {
                    return [type, token]
                }
            }
        })
    )

const IsError = token =>
    token.type == ERROR

const TokenStackToString = token =>
    token.type != EOF ? token.type.description + " " + TokenStackToString(token.next) : ""

const EatRule = (type, rule, token) =>
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
            let result = EatRule(type, rule, token)

            if ( !IsError(result) ) return result
        }

        return MakeError('foo', token)
    }

const Parse = (rules, token) =>
    Eat(rules, VALUE, token).body

///////////

const unwrapToken = ([token]) => token

///////////

const NUMBER  = Symbol("type#NUMBER")
const NAME    = Symbol("type#NAME")
const VALUE   = Symbol("type#VALUE")
const OPEN_P  = Symbol("type#OPEN_P")
const CLOSE_P = Symbol("type#CLOSE_P")
const LIST    = Symbol("type#LIST")

const types = [
    [OPEN_P, /^\($/],
    [CLOSE_P, /^\)$/],
    [NUMBER, /^[0-9]*$/],
    [NAME, /^[a-z\*\-\+\/\^]*$/],
]

const rules = new Map([
    MakeRulesForType(LIST, [
        MakeRule([ VALUE, LIST ], ([value, param]) => [value, ...param]),
        MakeRule([ VALUE ])
    ]),
    MakeRulesForType(VALUE, [
        MakeRule([ NUMBER ], unwrapToken),
        MakeRule([ OPEN_P, NAME, LIST, CLOSE_P ],
            ([_opp, name, params, _clp]) => [name, params]
        )
    ])
])

const tokens = Lex(types, "( + 1 ( * 4 6 ) )")

const ast = Parse(rules, tokens)
