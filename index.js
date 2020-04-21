const fs = require("fs")

const Lexer = require("./Lexer")
const Parse = require("./Parse")
const Rules = require("./Rules")

// lexer tokens
const NUMBER  = Symbol("type#NUMBER")
const NAME    = Symbol("type#NAME")
const OPEN_P  = Symbol("type#OPEN_P")
const CLOSE_P = Symbol("type#CLOSE_P")
const LET     = Symbol("type#LET")
const IF      = Symbol("type#IF")
const FN      = Symbol("type#FN")

// parser tokens
const VALUE   = Symbol("type#VALUE")
const LIST    = Symbol("type#LIST")
const PARAM   = Symbol("type#PARAM")

const types = [
    [OPEN_P,  /^\(/],
    [CLOSE_P, /^\)/],
    [NUMBER,  /^[0-9]*/],
    [LET,     /^let/],
    [IF,      /^if/],
    [FN,      /^fn/],
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
        Rule([ FN, OPEN_P, PARAM, CLOSE_P, VALUE ],
            ([ fn, _opp, params, _clp, value ]) => [fn, params, value]
        ),
        Rule([ OPEN_P, NAME, LIST, CLOSE_P ],
            ([_opp, name, params, _clp]) => [name, params]
        )
    ])
])

const file = fs.readFileSync("./source.txt").toString()
const tokens = Lexer(types, file)

const ast = Parse(rules, VALUE, tokens)

console.log(ast)

const operators = new Map([
    ["=", "=="],
    ["+",  "+"],
    ["*",  "*"],
    ["^", "**"]
])

let make = (ast, space="") => {
    if (ast[0] == "let") {
        return `const ${ast[1]} = ${make(ast[2])}\n${space}${ast[3][0] == "let" ? "" : "return "}${make(ast[3])}`
    }

    if (ast[0] == "if") {
        return `(${make(ast[1])} ? ${make(ast[2])} : ${make(ast[3])})`
    }

    if (ast[0] == "fn") {
        return `(${ast[1].join(", ")}) => {\n${space + "    "}${ast[2][0] == "let" ? "" : "return "}${make(ast[2], space + "    ")}\n${space}}`
    }

    if ( operators.has(ast[0]) ) {
        return `${make(ast[1][0])} ${operators.get(ast[0])} ${make(ast[1][1])}`
    }

    if (ast[0] == "+") {
        return `${make(ast[1][0])} + ${make(ast[1][1])}`
    }

    if (Array.isArray(ast)) {
        return `${ast[0]}(${ast[1].map(make).join(", ")})`
    }

    return ast
}

console.log( make(ast) )

{const x = 5; {const y = 6; {}}}