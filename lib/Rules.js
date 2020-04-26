const Rule = (name, pattern, include=true) => ({ name, pattern, include })

const KeyWord = (name, pattern) => Rule(name, pattern, false)

module.exports = { Rule, KeyWord }