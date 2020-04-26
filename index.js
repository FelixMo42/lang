const fs = require("fs")
const NFA = require("./grammar/NFA")

const Lexer = require("./lib/Lexer")
const Parse = require("./lib/Parse")
const Rules = require("./lib/Rules")

// lexer tokens
const NUMBER  = Symbol("Number")
const NAME    = Symbol("Name")
const OPEN_P  = Symbol("Open Parentheses")
const CLOSE_P = Symbol("Close Parentheses")
const LET     = Symbol("Let")
const IF      = Symbol("If")
const FN      = Symbol("Function")

// parser tokens
const VALUE   = Symbol("Value")
const LIST    = Symbol("List")
const PARAM   = Symbol("Param")

const types = [
    [OPEN_P,  /^\(/],
    [CLOSE_P, /^\)/],
    [NUMBER,  /^[0-9]*/],
    [LET,     /^let/],
    [IF,      /^if/],
    [FN,      /^def/],
    [NAME,    /^[a-z\*\-\+\/\^\=]*/],
]

const Unwrap = ([token]) => token


const rules = Rules(AddType => [
    AddType(LIST, Rule => [
        Rule([ VALUE, LIST ], ([value, list]) => [value, ...list]),
        Rule([ VALUE ])
    ]),
    AddType(PARAM, Rule => [
        Rule([ NAME, PARAM ], ([value, param]) => [value, ...param]),
        Rule([ NAME ])
    ]),
    AddType(VALUE, Rule => [
        Rule([ NAME ], Unwrap),
        Rule([ NUMBER ], ([number]) => Number.parseFloat(number)),
        Rule([ IF, VALUE, VALUE, VALUE ]),
        Rule([ LET, NAME, VALUE, VALUE ]),
        Rule([ FN, NAME, OPEN_P, PARAM, CLOSE_P, VALUE, VALUE],
            ([ _fn, name, _opp, params, _clp, body, value ]) => ["let", name, ["fn", params, body], value]
        ),
        Rule([ FN, OPEN_P, PARAM, CLOSE_P, VALUE ],
            ([ fn, _opp, params, _clp, value ]) => [fn, params, value]
        ),
        Rule([ OPEN_P, NAME, LIST, CLOSE_P ],
            ([_opp, name, params, _clp]) => [name, params]
        )
    ])
])