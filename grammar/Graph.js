const State = (data={}) => Object.assign([], data)

const Link = (from, to, input, data={}) => from.push(Object.assign([ input, to ], data))

module.exports = { State, Link }