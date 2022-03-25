const request = require('request')
const cheerio = require('cheerio')

request('https://movie.douban.com/chart', (err, res) => {
    if (err) {
        console.log(err.code)
    }
    else {
        let $ = cheerio.load(res.body)
        console.log($('#content>h1').text())
    }
})


