const PrintUnderlinedFilePortion = (file, start, end, tab="") => {
    let secStart = start
    let secEnd = end

    while ( secStart > 0 && file[secStart - 1] != "\n" ) secStart--

    while ( secEnd < file.length - 1 && file[secEnd] != "\n" ) secEnd++
    
    console.log( tab + file.substring(secStart, secEnd) )
    console.log( tab + " ".repeat(start - secStart) + "^".repeat(end - start) )
}