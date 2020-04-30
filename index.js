const fs = require("fs")
const immutable = require("immutable")
const Language = require("./lib/Language")

const UnWrap = ([term]) => term

// ust

const Function = ([ params, value ]) => ({ type: "function", params, value })
const FunctionCall = ([ func, arguments ]) => ({ type: "functionCall", func, arguments })
const If = ([ condtion, then, el ]) => ({ type: "if", condtion, then, el })
const Number = ([ number ]) => ({ type: "number", value: parseInt(number)})
const Variable = ([ name ]) => ({ type: "variable", name })
const Decleration = ([ key, value ]) => ({ type: "decleration" })

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
// console.log( JSON.stringify(ast, null, "   ") )

const Run = (node, scope=immutable.Map()) => {
    if ( node.type == "number" ) return node.value

    if ( node.type == "function" ) return node

    if ( node.type == "variable" ) return scope.get(node.name)

    if ( node.type == "functionCall" ) {
        let func = Run(node.func)

        console.log(func)

        // for (let i = 0; i < node.arguments.length; i++) {
        //     scope = scope.set( node.paramaters[i],  )
        // }

        // return Run(value, scope)
    }

    // if ( node.type == "" ) 
}

console.log(ast)

Run(ast, immutable.Map({
    "+": Function([], )
}))