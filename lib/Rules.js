const MakeRule = (steps, final=(params) => params) => {
    steps.final = final
    steps.ambiguous = 0
    
    return steps
}

const MakeRulesForType = (type, generator) => {
    let rules = generator(MakeRule)
    
    for (let rule of rules) {
        for (let comp of rules) {
            if (rule == comp) continue

            let ambiguous = 0

            for (let i = 0; i < Math.min(rule.length, comp.length); i++) {
                if ( rule[i] == comp[i] ) {
                    ambiguous += 1
                } else {
                    break
                }
            }

            rule.ambiguous = Math.max(rule.ambiguous, ambiguous)
            comp.ambiguous = Math.max(comp.ambiguous, ambiguous)
        }
    }
    
    return [type, rules]
}

const Rules = module.exports = generator => new Map(generator(MakeRulesForType))