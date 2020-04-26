const Language = require("./lib/Language")

let Parse = Language(({Word, KeyWord, Rule, Loop, Case}) => ({
    Open: KeyWord("open parenthesis", /^\(/),
    Close: KeyWord("close parenthesis" , /^\)/),
    Identifier: Word("symbol", /^[0-9a-zA-Z]*/),

    Value: Rule("value", ({ Open, Close, Value, Identifier }) => [
        Case([ Open, Loop(Value), Close ]),
        Case([ Identifier ], ([name]) => name)
    ]) 
}))

console.log( Parse( "(abc (a b))") )