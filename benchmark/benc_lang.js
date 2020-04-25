const NFA = require("../grammar/NFA")

const Lexer = require("../lib/Lexer")
const Parse = require("../lib/Parse")

const Expression = Symbol("Expression")
const Name       = Symbol("Name")
const Number     = Symbol("Number")
const Opp        = Symbol("Open Parenthasis")
const Cll        = Symbol("Close Parenthasis")
const File       = Symbol("File")

const types = [
    [Name,   /^[a-zA-Z_-][a-zA-Z0-9_-]*/],
    [Number, /^[0-9]+/],
    [Opp,    /^\(/],
    [Cll,    /^\)/],
]

let rules = new Map([
    [Expression, NFA.ToDFA( NFA.Final(
        NFA.Or(
            NFA.Step(Name),
            NFA.Step(Number),
            NFA.Union(
                NFA.Step( Opp ),
                NFA.Loop( NFA.Step( Expression ) ),
                NFA.Step( Cll ),
            )
        )
    ) ) ],
    [File, NFA.ToDFA( NFA.Final(
        NFA.Loop( NFA.Step( Expression ) )
    ) )]
])

module.exports = text => () => Parse(rules, File, Lexer(types, text))