const EMPTY = Symbol("Empty")

// ndfa building functions //

const Link = (from, to, input, ret=[from,to]) => {
    from.push([input, to])
    return ret
}

let id = 0

const State = (final=false) => {
    let state = []

    state.final = final
    state.id = id
    id += 1

    return state
}

const Step = input => Link(State(), State(), input)

const Loop = set => Link(set[1], set[0], EMPTY, set)

const Optional = set => Link(set[0], set[1], EMPTY, set)

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

// nfa utility functions //

const GetStatesOfNFA = nfa => {
    let states = new Set()

    GetStateOfNFA( nfa[0], states)

    return states
}

const GetStateOfNFA = (state, states) => {
    if ( states.has(state) ) return

    states.add( state )

    state.forEach(([input, next]) => GetStateOfNFA(next, states))
}

// dfa //

const MakeStateDFA = () => ({
    substates: new Set(),
    connections: new Map()
})

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

const ExpandStateFromSubstates = (baseSubstates) => {
    let substates = new Set()
    let connections = new Map()

    for (let substate of baseSubstates) {
        ExpandStateFromSubstate(substates, connections, substate)
    }

    return [substates, connections]
}

const DFA = {}

DFA.StateName = (substates) => {
    let name = ""

    for (let substate of [...substates].sort((a, b) => a.id - b.id)) {
        name += substate.id + ","
    }

    return name
}

DFA.MapConnectionsToStateNames = (dfa, connections) => {
    let map = new Map()

    for (let [input, baseSubstates] of connections.entries()) {
        let [substates, connections] = ExpandStateFromSubstates(baseSubstates)

        map.set(input, DFA.StateName(substates))
    }

    return map
}

DFA.IncludesState = (dfa, substates) => dfa.has( DFA.StateName( substates ) )

const ToDFA = nfa => {
    let dfa = new Map()

    let todo = [ new Set([ nfa[0] ]) ]
    
    for (let baseSubstates of todo) {
        let [substates, connections] = ExpandStateFromSubstates(baseSubstates)

        if (  DFA.IncludesState(dfa,  substates) ) continue

        dfa.set( DFA.StateName(substates), DFA.MapConnectionsToStateNames(dfa, connections) )

        connections.forEach(baseSubstates => todo.push(baseSubstates))
    }

    return dfa
}

// test //

const A = Symbol("A")
const B = Symbol("B")

let nfa =
    Optional(
        Union(
            Loop( Step( A ) ),
            Step( B )
        )
    )

console.log( ToDFA(nfa) )