module.exports = {
    reduce: (iterator, rec, init) => {
        let sum = init

        for (let value of iterator) {
            sum = rec( sum, value )
        }

        return sum
    },

    sum: (iterator, tranfom = a => a, init = 0) => {
        let sum = init

        for (let value of iterator) {
            sum += tranfom( value )
        }

        return sum
    },

    some: (iterator, func = a => a) => {
        for (let value of iterator) if ( func( value ) ) return true

        return false
    },
}