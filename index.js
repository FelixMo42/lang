const fs = require("fs")
const { Map } = require("immutable")
const Language = require("./lib/Language")

const UnWrap = ([term]) => term

// ust

const Function = ([ params, value ]) => ({ type: "function", params, value })
const FunctionCall = ([ func, arguments ]) => ({ type: "functionCall", func, arguments })
const If = ([ condtion, then, el ]) => ({ type: "if", condtion, then, el })
const Number = ([ number ]) => ({ type: "number", value: parseInt(number)})
const Refrence = ([ name ]) => ({ type: "refrence", name })

const Scope = (parent=Map()) => parent
const Variable = (scope, key, type, value) => {
}

//

let Parse = Language(({Word, KeyWord, Rule, Loop, Case}) => ({
    // key words
    IF : KeyWord("if"),

    // puncutation
    SPEC : KeyWord("specifier", /^:/),
    OPEN : KeyWord("open parentheses", /^\(/),
    CLOSE : KeyWord("close parentheses", /^\)/),

    // words in the grammar
    number : Word("number", /^[0-9]*/),
    name : Word("name", /^[a-zA-Z\*\-\+\/\^\=]*/),

    // parsing rules
    value : Rule("value", ({ IF, OPEN, CLOSE, number, name, value, paramaters, arguments }) => [
        Case([ name ], Refrence),
        Case([ number ], Number),

        Case([ OPEN, OPEN, paramaters, CLOSE, value, CLOSE ], Function),

        Case([ OPEN, value, arguments, CLOSE ], FunctionCall),

        Case([ IF, value, value, value ], If)
    ]),

    arguments : Rule("arguments", ({ value }) => [
        Case([ Loop( value ) ])
    ]),

    paramaters : Rule("params", ({ SPEC, name, type }) => [
        Case([ Loop(name, SPEC, type) ])
    ]),

    type : Rule("type", ({ name }) => [
        Case([ name ], UnWrap)
    ]),

    // options
    start_rule: "value"
}))

//

const ast = Parse( fs.readFileSync("main.ust").toString() )

const root = Scope()



console.log( JSON.stringify(ast, null, "   ") )