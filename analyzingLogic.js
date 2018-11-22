
const cheerio = require('cheerio');

function analyzing(htmlStr){
    const $ = cheerio.load(htmlStr);
    const table = $('table');
    const trs = table.find('tr');
    let result = [];
    trs.each(function(index,tr){
        let frontNumbers = [];
        $(tr).find('.red').each(function(j,td){
            frontNumbers.push($(td).text());
        });

        let behindNumbers = [];
        $(tr).find('.blue').each(function(j,td){
            behindNumbers.push("#" + $(td).text());
        });
        if(frontNumbers.length && behindNumbers.length)
        result.push(frontNumbers.concat(behindNumbers));
    });
    console.log(result);

    return result;
}

module.exports = analyzing;