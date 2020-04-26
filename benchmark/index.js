const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()

let text = `\
    (list 1 2 (cons 1 (list)))
    (print 5 golden rings)
`;

suite
    .add('lang', require("./benc_lang")(text))
    // .add('langV2', require("./benc_lang2")(text))
    // .add('parsimmon', require("./benc_parsimmon")(text))
    
    .on('cycle', function(event) {
        console.log(String(event.target))
    })
    .on('complete', function() {
        console.log('Fastest is ' + this.filter('fastest').map('name'))
    })

    .run()