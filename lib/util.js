if (!Array.prototype.last){
    Array.prototype.last = function() {
        return this[this.length - 1]
    }
}

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

    all: (iterator, func = a => a) => {
        for (let value of iterator) if ( !func( value ) ) return false

        return true
    },

    first: (iterator, func = a => a, def) => {
        for (let value of iterator) if ( func( value ) ) return value

        return def
    },

    map: function *(iterator, func) {
        for (let value of iterator) {
            yield func(value)
        }
    },

    get: function *(iterator, key) {
        for (let value of iterator) {
            yield value[key]
        }
    },

    batch: function *(iterator, size=2) {
        let sec = []
        
        for (let value of iterator) {
            sec.push( value )

            if ( sec.length == size ) {
                yield sec
                sec = []
            }
        }

        yield sec
    }
}