const MakeRule = (steps, final=(params) => params) =>
    {
        steps.final = final
        return steps
    }

const MakeRulesForType = (type, rules) =>
    [type, rules(MakeRule)]

const Rules = module.exports = generator =>
    new Map(generator(MakeRulesForType))