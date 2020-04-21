const MakeError = (text, next) => Result(text, next, true)

const Result = (body, next, err=false) => ({body, next, err})

const IsError = result => result.err

const IsRequired = (rule, i) => i > rule.ambiguous

const GetType = position => tokens[position][0]
const GetBody = position => tokens[position][1]

const EatRule = (rules, rule, position) => {
    let next = position
    let body = []

    for (let i = 0; i < rule.length; i++) {
        let step = rule[i]

        result = Eat(rules, step, next)

        if ( IsError(result) ) {
            if ( !IsRequired(rule, i) ) return MakeError(result, position)

            console.log( result.body.text )
        }

        body.push(result.body)
        next = result.next
    }

    return Result(rule.final(body), next)
}

const Eat = (rules, type, position) => {
    if ( tokens[position][0] == type) return Result(tokens[position][1], position + 1)

    if ( !rules.has(type) ) return MakeError(
        `got token of type ${ tokens[position][0].description}, expected ${type.description}`,
        position + 1
    )

    for (let rule of rules.get(type)) {
        let result = EatRule(rules, rule, position)

        if ( !IsError(result) ) return result
    }

    return MakeError(
        `unexpected token "${tokens[position][1]}" of type ${tokens[position][0].description}`,
        position + 1
    )
}

const Parse = (rules, fileType, _tokens) => {
    tokens = [..._tokens, [ Symbol("EOF"), "" ]]

    return Eat(rules, fileType, 0).body
}

module.exports = Parse