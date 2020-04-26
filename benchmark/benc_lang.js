const Language = require("../lib/Language")

const unwrap = ([name]) => name

let parse = Language(({Word, KeyWord, Rule, Loop, Optional, Case}) => ({
    name: Word("name", /^[a-zA-Z_-][a-zA-Z0-9_-]*/),
    number: Word("number", /^[0-9]+/),

    open: KeyWord("open", /^\(/),
    close: KeyWord("close", /^\)/),

    expression: Rule("expression", ({name, number, open, close, expression}) => [
        Case([ name ], unwrap),
        Case([ number ], unwrap),
        Case([ open, Loop( expression ), close ])
    ]),

    file: Rule("file", ({expression}) => [
        Case([ Loop(expression) ])
    ]),

    start_rule: "file"
}))

if (require.main === module) {
    console.log( JSON.stringify(parse(`\
        (list 1 2 (cons 1 (list)))
        (print 5 golden rings)
    `), null, "   ") )
}

module.exports = text => () => parse(text)