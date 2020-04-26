const _ = require("../util")

const Graph = require("./Graph")

const FinalStateMiddleware = {
    init: () => ({ final: false }),
    merge: (substates) => ({ final : _.some(substates, substate => substate.final) })
}

module.exports = (middleware=FinalStateMiddleware) => {
    this.EMPTY = EMPTY = Symbol("Empty")

    // ndfa building functions //

    let id = 1

    const GetId = () => {
        let old = id

        id <<= 1

        return old
    }

    const State = () => Graph.State({ id: GetId(), ...middleware.init() })

    const Link = (from, to, input, ret=[from,to]) => {
        Graph.Link(from, to, input)

        return ret
    }

    this.Set = (set, ...params) => {
        middleware.set(set[1], ...params)
    }

    this.Final = (set, final) => {
        set[1].final = final

        return set
    }

    this.Step = input => Link(State(), State(), input)

    this.Loop = set => Link(set[1], set[0], EMPTY, set)

    this.Optional = set => Link(set[0], set[1], EMPTY, set)

    this.Union = (...sets) => [
        sets[0][0],
        sets.reduce((last, curr) => Link(last[1], curr[0], EMPTY, curr))[1]
    ]

    this.Or = (...sets) => {
        let first = State()
        let last = State()

        sets.forEach(set => {
            Link(first, set[0], EMPTY)
            Link(set[1], last, EMPTY)
        })

        return [first, last]
    }

    // dfa //

    const StateNameFromSubstates = substates => _.sum(substates, substate => substate.id)

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

    const StateFromSubstates = base => {
        let substates = new Set()
        let connections = new Map()

        for (let substate of base) ExpandStateFromSubstate(substates, connections, substate)

        return [ StateNameFromSubstates(substates), middleware.merge(substates), connections ]
    }

    const AddStateToDFA = (dfa, baseSubstates) => {
        let [ stateName, data, connections ] = StateFromSubstates(baseSubstates)

        if ( dfa.has( stateName ) ) return dfa.get( stateName )

        let state = Graph.State(data)

        dfa.set( stateName, state )

        for (let [ input, baseSubstates ] of connections.entries())
            Graph.Link( state, AddStateToDFA(dfa, baseSubstates), input )

        return state
    }

    this.ToDFA = nfa => AddStateToDFA(new Map(), [ nfa[0] ])

    return this
}