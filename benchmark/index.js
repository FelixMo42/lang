const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()

let text = `\
    (list 1 2 (cons 1 (list)))
    (print 5 golden rings)
`;

// console.log(
//     require("./benc_parsimmon")(text)(),
//     require("./benc_lang")(text)(),
// )

suite
    .add('langV1', require("./benc_langV1")(text))
    .add('langV2', require("./benc_langV2")(text))
    .add('parsimmon', require("./benc_parsimmon")(text))
    
    .on('cycle', function(event) {
        console.log(String(event.target))
    })
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'))
    })

    .run()