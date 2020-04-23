const EMPTY = Symbol("Empty")

// ndfa //

const Link = (from, to, input, ret=[from,to]) => {
    from.push(input, to)
    return ret
}

const Step = input => Link([], [], input)

const Loop = set => Link(set[1], set[0], EMPTY, set)

const Optionel = set => Link(set[0], set[1], EMPTY, set)

const Union = (...sets) => [
    sets[0][0],
    sets.reduce((last, curr) => Link(last[1], curr[0], EMPTY, curr))[1]
]

let Or = (...sets) => {
    let first = []
    let last = []

    sets.forEach(set => {
        Link(first, set[0])
        Link(set[1], last)
    })

    return [first, last]
}

// dfa //

const AddToState = (state, tracker) => {
    if ( tracker.has( state ) ) return

    for (let [input, next] of state) {
        if (input == EMPTY) AddToState(next, tracker)
    }
}

const ToDFA = nfa => {
    let tracker = new Map()

    return dfa
}

// test //

const A = Symbol("0")
const B = Symbol("1")

let nfa = Optionel( Union( Loop( Step(A) ), Step(B) ) )

console.log(nfa)