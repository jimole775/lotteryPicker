const fs = require('fs');
const analyzingHtml = require('./analyzingHtml');
const Request = require('./requestLogic');
const pages = 89;

for(var i = 1;i<pages;i++){
    let dirStr = '/historykj';
    let pathStr = '/history_' + 1 + '.jspx';
    let queryStr = '?_ltype=dlt';
    
    fetching(dirStr + pathStr + queryStr);
}

async function fetching(path){

    const req = new Request();

    const options = {
        protocal:"http:",
        path: path,
        hostname: 'www.lottery.gov.cn',
        port: 80,
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    
    await req.fetch(options,function(htmlChunk){
        const ws = fs.createWriteStream(__dirname + '/result.txt', 'utf-8');
        const peerPageNumbers = analyzingHtml(htmlChunk.toString());
        peerPageNumbers.forEach(function(item){
            ws.write(item.toString() + '\n\r');
        });    
        ws.end();
    });
}



