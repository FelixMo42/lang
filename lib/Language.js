const _ = require("./util")
const NFA = require("./NFA")({
    init: () => ({ final: false }),
    merge: (substates) => ({ final : _.first( _.get(substates, "final"), a => a, false) })
})

const Lexer = require("./Lexer")
const Parse = require("./Parse")

const AddTo = (arr, el) => {
    arr.push(el)

    return el
}

module.exports = generator => {
    let lexingRules = []
    let parserRules = []

    // Lexer rules

    const Word = (name, pattern, include=true) =>
        AddTo(lexingRules, { name, pattern, include, isWord: true })

    const KeyWord = (name, pattern=name, include=false) => Word(name, pattern, include)

    // Parers rules

    const Sequence = nodes => NFA.Union( nodes.map(el => Array.isArray(el) ? el : NFA.Step(el)) )

    const Loop = (...seq) => NFA.Optional( NFA.Loop( Sequence( seq ) ) )
    const OnePlus = (...seq) => NFA.Loop( Sequence( seq ) )
    const Optional = (...seq) => NFA.Optional( Sequence( seq ) )
    const Or = seqs => NFA.Or( seqs.map(Sequence) )

    const Case = (rule, func = a => a) => NFA.Final(Sequence(rule), func)

    const Rule = (name, cases, include = true) => AddTo(parserRules, { name, rule: cases, include })

    // makes the rules

    let language = generator({ Word, KeyWord, Rule, Case, Loop, OnePlus, Optional, Or })

    for (let rule of parserRules) rule.rule = NFA.ToDFA( NFA.Or( rule.rule(language) ) )

    // options

    let start_rule = language.start_rule

    let Parse = language.parse || require("./Parse")
    let Lexer = language.lexer || require("./Lexer")

    return file => Parse(language[start_rule], Lexer(lexingRules, file))
}