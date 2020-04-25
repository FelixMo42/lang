module.exports = (types, file) => {
    let tokens = []

    let char = 0

    while (file.length > 0) {
        let lexemeType = null
        let lexeme = ""
        let length = 0

        for (let [type, pattern] of types) {
            let match = file.match(pattern)

            if ( match && match[0].length > length ) {
                lexemeType = type
                lexeme = match[0]
                length = match[0].length
            }
        }

        char += length

        if (length != 0) tokens.push([ lexemeType, lexeme + "[" + char + "]" ])

        file = length == 0 ? file.substring(1) : file = file.substring(length)
    }

    return tokens
}