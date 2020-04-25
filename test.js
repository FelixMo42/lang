const NFA = require("./grammar/NFA")
const Lexer = require("./lib/Lexer")
const Parse = require("./lib/Parse")

const OPEN = Symbol("(")
const CLOSE = Symbol(")")
const SYMBOL = Symbol("Symbol")

const VALUE = Symbol("Value")

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
], "(abc (a b)))") ) )