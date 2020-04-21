const Lexer = require("../lib/Lexer")
const Parse = require("../lib/ParseV1")
const Rules = require("../lib/Rules")

const Expression = Symbol("Expression")
const Name       = Symbol("Name")
const Number     = Symbol("Number")
const List       = Symbol("List")
const Opp        = Symbol("Open Parenthasis")
const Cll        = Symbol("Close Parenthasis")

const types = [
    [Name, /^[a-zA-Z_-][a-zA-Z0-9_-]*/],
    [Number, /^[0-9]+/],
    [Opp,    /^\(/],
    [Cll,    /^\)/],
]

let rules = Rules(Ruleset => [
    Ruleset(Expression, Rule => [
        Rule([ Name ]),
        Rule([ Number ]),
        Rule([ Opp, List, Cll ]),
    ]),

    Ruleset(List, Rule => [
        Rule([ Expression, List ], ([value, list]) => [value, ...list]),
        Rule([ Expression ])
    ])
])

module.exports = text => () => Parse(rules, List, Lexer(types, text))