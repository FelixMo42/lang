const ERROR = Symbol("error")

module.exports = (type, tokens) => {
    function Eat(type, index) {
        if ( index >= tokens.length ) return [ ERROR, index ]

        if ( typeof type === "string" ) return tokens[index][1][0] === type ?
                [ tokens[index][1], index + 1 ] : [ ERROR, index ]

        if ( tokens[index][0] === type ) return [ tokens[index][1], index + 1 ]

        if ( type.isWord ) return [ ERROR, index ]

        let body = []
        let rule = type.rule

        outer: while (true) {
            for (let [ step, next ] of rule) {
                let [ node, pos ] = Eat(step, index)
                
                if ( node === ERROR ) continue
                
                if ( step.include ) body.push( node )

                rule = next

                index = pos

                continue outer
            }

            // We can't consume any more tokens, if this is a valid end then return the body
            // else weve got an error on our hands.
            return rule.final !== false ? [ rule.final(body), index ] : [ ERROR, index + 1 ]
        }
    }

    return Eat(type, 0)[0]
}