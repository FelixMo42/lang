const NFA = require("./grammar/NFA")
const Lexer = require("./lib/Lexer")
const Parse = require("./lib/ParseV2")

const OPEN = Symbol("open parenthesis")
const CLOSE = Symbol("close parenthesis")
const SYMBOL = Symbol("symbol")

const VALUE = Symbol("value")

const rules = new Map([
    [ VALUE,  NFA.ToDFA( NFA.Final( NFA.Or(
        NFA.Union(
            NFA.Step( OPEN ),
            NFA.Loop( NFA.Step( VALUE ) ),
            NFA.Step( CLOSE )
        ),
        NFA.Step( SYMBOL )
    ) ) ) ]
])

console.log( Parse( rules, VALUE, Lexer([
    [ OPEN,   /^\(/ ],
    [ CLOSE,  /^\)/ ],
    [ SYMBOL, /^[0-9a-zA-Z]*/ ],
], "(abc () (a b))") ) )