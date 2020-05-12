const fs = require("fs")
const _ =require("./lib/util")
const immutable = require("immutable")
const Language = require("./lib/Language")

const UnWrap = ([term]) => term

// ust

const Node = (name, args) => {
    function type(data) { return { type, data } }

    type.name = name

    return type
}

const Number       = Node("number", [ "value" ])
const Function     = Node("function", [ "params", "value" ])
const FunctionCall = Node("functionCall", [ "func", "arguments" ])
const If           = Node("if", [ "condtion", "then", "else" ])
const Variable     = Node("variable", [ "name" ])
const Decleration  = Node("decleration", [ "key", "value" ])

// const Programme = (data) => ({ functions: new Map(), baseScope: immutable.Map(data) })
// const Scope = (parent=immutable.Map()) => parent
// const Variable = (scope, key, type, value) => scope.set(({key, type, value}))

//

let Parse = Language(({Word, KeyWord, Rule, Loop, Case}) => ({
    // key words
    IF : KeyWord("if"),

    // puncutation
    PUNCS : KeyWord("specifier", /^[\:\[\]\(\)\{\}]/),

    // words in the grammar
    number : Word("number", /^[0-9]*/),
    name : Word("name", /^[a-zA-Z\*\-\+\/\^\=]*/),

    // parsing rules
    value : Rule("value", ({ number, name, value, paramaters, arguments }) => [
        Case([ name ], Variable),
        Case([ number ], Number),

        Case([ "(", "[", paramaters, "]", value, ")" ], Function),

        Case([ "(", value, arguments, ")" ], FunctionCall),

        Case([ "if", value, value, value ], If)
    ]),

    arguments : Rule("arguments", ({ value }) => [
        Case([ Loop( value ) ])
    ]),

    paramaters : Rule("paramaters", ({ paramater }) => [
        Case([ Loop( paramater ) ])
    ]),

    paramater : Rule("paramaters", ({ name, type }) => [
        Case([ name, ":", type ])
    ]),

    type : Rule("type", ({ name }) => [
        Case([ name ], UnWrap)
    ]),

    // options
    start_rule: "value"
}))

//

const ast = Parse( fs.readFileSync("main.ust").toString() )

const Scope = new Map([
    ["+", (a, b) => a + b]
])

const Crawler = (callbacks) => {
    const Crawl = (node, scope) => map.get(node.type)(scope)(...node.data)

    const map = new Map( callbacks.map(type => [type[0], type[1](Crawl)]) )

    return Crawl
}

const ERROR   = () => () => () => "Error"
const BOOLEAN = () => () => () => "boolean"
const NUMBER  = () => () => () => "number"

const Crawl = Crawler([
    [ Number, NUMBER ],
    [ Variable, (name) => Scope.get(name) ],

    [ If, typeOf => scope => (condition, then, el) => 
        expect( typeOf(condition, scope) ).toBe( BOOLEAN ) ? ERROR :

        joinTypes( typeOf( then, scope ), typeOf( el, scope ) )
    ],
])

console.log( Crawl(ast) )