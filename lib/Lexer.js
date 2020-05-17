module.exports = (types, file) => {
    // this list of tokens in the file
    let tokens = []

    // add the base file incase its needed latter one
    tokens.file = file

    // keep track of current position in file
    let start = 0

    // keep on going until we finish lexing the file
    while (file.length > 0) {
        // the type of the longest found token 
        let lexemeType = null

        // the body of the token
        let lexeme = ""

        // the length of the token
        let length = 0

        // try matching each type
        for (let type of types) {
            // get the match
            let match = file.match(type.pattern)

            // if we have a match and its longer than previus matches
            if ( match && match[0].length > length ) {
                lexemeType = type
                lexeme = match[0]
                length = match[0].length
            }
        }

        // move up the current positon in the file
        start += length

        // if we actually have a token add it to the list of tokens
        if (length != 0) tokens.push([ lexemeType, [ lexeme, start ] ])

        // remove the start of the file, minum 1 character,
        // so that we dont get stuck in an infinite loop
        file = length == 0 ? file.substring(1) : file = file.substring(length)
    }

    return tokens
}


