const Benchmark = require('benchmark')
const suite = new Benchmark.Suite()

let text = `\
    (list 1 2 (cons 1 (list)))
    (print 5 golden rings)
`;

suite
    .add('lang', require("./benc_lang")(text))
    .add('lang2', require("./benc_lang2")(text))

    .on('cycle', event => console.log(String(event.target)))
    .on('complete', function () {
        console.log('Fastest is ' + this.filter('fastest').map('name'))
    })

    .run()