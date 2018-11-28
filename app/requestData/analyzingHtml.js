
const fs = require('fs');
const path = require('path');
let countPage = 0;
const logWs = fs.createWriteStream(path.resolve(__dirname,'../../db/html.log'),'utf8');
function analyzing(htmlStr){
    const tbodyStartIndex = htmlStr.indexOf('<tbody');
    const tbodyEndIndex = htmlStr.indexOf('</tbody>');
    let tbodyHtmlStr = htmlStr.substring(tbodyStartIndex,tbodyEndIndex);
    tbodyHtmlStr = tbodyHtmlStr.replace(/,/g,''); //获取的数据经常有逗号把数据切断，在这里统一处理掉
    let tds = tbodyHtmlStr.split('</td>');
    
    let result = [];
    let frontItems = [];
    let behindItems = [];
    tds.forEach((peerTD)=>{
        if(peerTD.indexOf('red') > -1){
            frontItems.push(peerTD.substr(peerTD.length-2,2));
            logWs.write(peerTD + '\r');
        }

        if(peerTD.indexOf('blue') > -1){
            behindItems.push('#' + peerTD.substr(peerTD.length-2,2));
            logWs.write(peerTD + '\r');
        }

        if(frontItems.length === 5 && behindItems.length === 2){
            result.push(frontItems.concat(behindItems));

            frontItems.length = 0;
            behindItems.length = 0;
        }
    }); 
    countPage ++;
    return result;
}

if(countPage >= 88){
    logWs.end();
}

module.exports = analyzing;