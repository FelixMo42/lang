const operators = new Map([
    ["==","=="],
    ["!=","!="],
    [">=",">="],
    ["<=","<="],
    ["<",  "<"],
    [">",  ">"],
    ["+",  "+"],
    ["-",  "-"],
    ["*",  "*"],
    ["/",  "/"],
    ["^", "**"]
])

let RetNext = (ast, space) => `\n${space}${ast[0] == "let" || ast[0] == "def" ? "" : "return "}${ToJs(ast, space)}`

let ToJs = (ast, space="") => {
    if (ast[0] == "let") {
        return `const ${ast[1]} = ${ToJs(ast[2])}${RetNext(ast[3], space)}`
    }

    if (ast[0] == "if") {
        return `(${ToJs(ast[1])} ? ${ToJs(ast[2])} : ${ToJs(ast[3])})`
    }

    if (ast[0] == "fn") {
        return `(${ast[1].join(", ")}) => {${RetNext(ast[2], space + "    ")}`
    }

    if (ast[0] == "def") {
        return `let ${ast[1]} = (${ast[2].join(", ")}) => {${RetNext(ast[3], space + "    ")}\n${space}}${RetNext(ast[4], space)}`
    }

    if ( operators.has(ast[0]) ) {
        return `(${ToJs(ast[1][0])} ${operators.get(ast[0])} ${ToJs(ast[1][1])})`
    }

    if (Array.isArray(ast)) {
        return `${ast[0]}(${ast[1].map(ToJs).join(", ")})`
    }

    return ast
}

module.exports = ToJs