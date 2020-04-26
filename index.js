const Language = require("./lib/Language")

let Parse = Language(({Word, KeyWord, Rule, Loop, Optional, Case}) => ({
    // key words
    LET    : KeyWord("let"),
    DEF    : KeyWord("def"),
    IF     : KeyWord("if"),
    OPEN   : KeyWord("Open Parentheses", /^\(/),
    CLOSE  : KeyWord("Close Parentheses", /^\)/),

    // words in the grammar
    number : Word("number", /^[0-9]*/),
    name   : Word("name", /^[a-zA-Z\*\-\+\/\^\=]*/),

    // parsing rules
    value  : Rule("value", ({LET, DEF, IF, OPEN, CLOSE, number, name, value}) => [
        Case([ name ]),
        Case([ number ]),
        Case([ IF, value, value, value ]),
        Case([ LET, name, value, value ]),
        Case([ DEF, Optional(name), OPEN, Loop(name), CLOSE,  value, value ]),
        Case([ OPEN, name, Loop(value), CLOSE ])
    ]),

    // paramtaers
    start_rule: "value"
}))

console.log( Parse( "(abc (a b))") )