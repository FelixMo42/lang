const _ = require("../util")

const Graph = require("./Graph")

const NFA = module.exports = {}

NFA.EMPTY = EMPTY = Symbol("Empty")

// ndfa building functions //

let id = 1

const GetId = () => {
    let old = id

    id <<= 1

    return old
}

const State = () => Graph.State({ final: false, id: GetId() })

const Link = (from, to, input, ret=[from,to]) => {
    Graph.Link(from, to, input)

    return ret
}

NFA.Final = (set) => {
    set[1].final = true

    return set
}

NFA.Step = input => Link(State(), State(), input)

NFA.Loop = set => Link(set[1], set[0], EMPTY, set)

NFA.Optional = set => Link(set[0], set[1], EMPTY, set)

NFA.Union = (...sets) => [
    sets[0][0],
    sets.reduce((last, curr) => Link(last[1], curr[0], EMPTY, curr))[1]
]

NFA.Or = (...sets) => {
    let first = State()
    let last = State()

    sets.forEach(set => {
        Link(first, set[0], EMPTY)
        Link(set[1], last, EMPTY)
    })

    return [first, last]
}

// dfa //

const StateNameFromSubstates = substates => {
    return _.sum(substates, substate => substate.id)
}

const ExpandStateFromSubstate = (substates, connections, substate) => {
    if ( substates.has(substate) ) return

    substates.add(substate)

    for (let [input, connection] of substate) {
        if (input == EMPTY) {
            ExpandStateFromSubstate(substates, connections, connection)
        } else {
            if ( !connections.has( input ) ) connections.set( input , new Set() )

            connections.get( input ).add( connection )
        }
    }
}

const StateFromSubstates = (baseSubstates) => {
    let substates = new Set()
    let connections = new Map()

    for (let substate of baseSubstates) ExpandStateFromSubstate(substates, connections, substate)

    return [
        StateNameFromSubstates(substates),
        _.some(substates, substate => substate.final),
        connections
    ]
}

const AddStateToDFA = (dfa, baseSubstates) => {
    let [ stateName, final, connections ] = StateFromSubstates(baseSubstates)

    if ( dfa.has( stateName ) ) return dfa.get( stateName )

    let state = Graph.State({ final })

    dfa.set( stateName, state )

    for (let [ input, baseSubstates ] of connections.entries())
        Graph.Link( state, AddStateToDFA(dfa, baseSubstates), input )

    return state
}

NFA.ToDFA = nfa => AddStateToDFA(new Map(), [ nfa[0] ])