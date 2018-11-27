
const cheerio = require('cheerio');


function analyzing(htmlStr){
    const tbodyStartIndex = htmlStr.indexOf('<tbody ');
    const tbodyEndIndex = htmlStr.indexOf('</tbody>');
    // const $ = cheerio.load(htmlStr);
    // const tbody = $('table').find('tbody');
    // const trs = tbody.find('tr');
    const tbodyHtmlStr = htmlStr.substring(tableStartIndex,tableEndIndex);

    let result = [];
    trs.each(function(index,tr){
        let frontNumbers = [];        
        let behindNumbers = [];
        tr.children.forEach(function(td,index){  
            if(td.type === 'tag' && td.name === 'td' && td.attribs){
                var [{text,data}] = td.children;
                var attribs = JSON.stringify(td.attribs); 
                if(attribs.indexOf('red') > -1 && data)frontNumbers.push(data.trim().substr(0,2));
                if(attribs.indexOf('blue') > -1 && data)behindNumbers.push("#" + data.trim().substr(0,2));                
            }
        });
        result.push(frontNumbers.concat(behindNumbers));
    });

    return result;
}

module.exports = analyzing;