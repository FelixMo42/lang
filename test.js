const _ = require("./util")

const NFA = require("./grammar/NFA")({
    init: () => ({ final: false }),
    merge: (substates) => ({ final : _.first( _.get(substates, "final"), a => a, false) })
})

const { Rule, KeyWord } = require("./lib/Rules")

const Lexer = require("./lib/Lexer")
const Parse = require("./lib/Parse")

const OPEN = KeyWord("open parenthesis", /^\(/)
const CLOSE = KeyWord("close parenthesis" , /^\)/)
const SYMBOL = Rule("symbol", /^[0-9a-zA-Z]*/)

const VALUE = Rule("value")

const rules = new Map([
    [ VALUE,  NFA.ToDFA( NFA.Or(
        NFA.Final(
            NFA.Union( NFA.Step( OPEN ), NFA.Loop( NFA.Step( VALUE ) ), NFA.Step( CLOSE ) ),
            (params) => params
        ),
        NFA.Final(
            NFA.Step( SYMBOL ),
            ([name]) => name
        )
    ) ) ]
])

// console.log( rules )

console.log( Parse( rules, VALUE, Lexer([ OPEN, CLOSE, SYMBOL ], "(abc (a b))") ) )