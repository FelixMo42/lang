module.exports = (types, file) => {
    let tokens = []
    let start = 0

    while (file.length > 0) {
        let lexemeType = null
        let lexeme = ""
        let length = 0

        for (let type of types) {
            let match = file.match(type.pattern)

            if ( match && match[0].length > length ) {
                lexemeType = type
                lexeme = match[0]
                length = match[0].length
            }
        }

        start += length

        if (length != 0) tokens.push([ lexemeType, lexeme ])

        file = length == 0 ? file.substring(1) : file = file.substring(length)
    }

    return tokens
}