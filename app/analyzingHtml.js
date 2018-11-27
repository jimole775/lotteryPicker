
const cheerio = require('cheerio');


function analyzing(htmlStr){
    const tbodyStartIndex = htmlStr.indexOf('<tbody ');
    const tbodyEndIndex = htmlStr.indexOf('</tbody>');
    // const $ = cheerio.load(htmlStr);
    // const tbody = $('table').find('tbody');
    // const trs = tbody.find('tr');
    const tbodyHtmlStr = htmlStr.substring(tbodyStartIndex,tbodyEndIndex);
    const frontRegx = /<td align="center" bgcolor="[A-Z0-9]+" class="red">\d+<\/td>/g;
    const behindRegx = /<td width="\d+" align="center" bgcolor="[A-Z0-9]+" class="blue">\d+<\/td>/g;
    let frontTDArray = tbodyHtmlStr.match(frontRegx);
    let behindTDArray = tbodyHtmlStr.match(behindRegx);
  
    frontTDArray = frontTDArray.map((item)=>{
        item = item.replace(/<td align="center" bgcolor="[A-Z0-9]+" class="red">/g,'');
        return item = item.replace(/<\/td>/g,'');
    });
    behindTDArray = behindTDArray.map((item)=>{
        item = item.replace(/<td width="\d+" align="center" bgcolor="[A-Z0-9]+" class="blue">/g,'');
        item = item.replace(/<\/td>/g,'');
        return '#' + item;
    });
    
    let result = [];
    let peerItram = [];
    let behindItraor = 0;
    frontTDArray.forEach((item,index)=>{
        peerItram.push(item); 
        if(index%5 === 0){
            peerItram.push(behindTDArray[behindItraor++]);
            peerItram.push(behindTDArray[behindItraor++]);
            result.push(JSON.parse(JSON.stringify(peerItram)));
            peerItram = [];
        }
        result.push(item.concat(behindTDArray[index]));
    });

    // trs.each(function(index,tr){
    //     let frontNumbers = [];        
    //     let behindNumbers = [];
    //     tr.children.forEach(function(td,index){  
    //         if(td.type === 'tag' && td.name === 'td' && td.attribs){
    //             var [{text,data}] = td.children;
    //             var attribs = JSON.stringify(td.attribs); 
    //             if(attribs.indexOf('red') > -1 && data)frontNumbers.push(data.trim().substr(0,2));
    //             if(attribs.indexOf('blue') > -1 && data)behindNumbers.push("#" + data.trim().substr(0,2));                
    //         }
    //     });
    //     result.push(frontNumbers.concat(behindNumbers));
    // });

    return result;
}

module.exports = analyzing;