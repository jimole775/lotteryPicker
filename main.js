const fs = require('fs');
const analyzingLogic = require('./analyzingLogic');
const Request = require('./requestLogic');
const pages = 89;

for(let i = 0;i < pages;i++){
    
}

const options = {
    // history_89.jspx?_ltype=dlt
    path: '/historykj/history_1.jspx?_ltype=dlt',
    hostname: 'www.lottery.gov.cn',
    port: 80,
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

const req = new Request();
req.fetch(options,function(htmlChunk){    
    const ws = fs.createWriteStream(__dirname + '/result.txt', 'utf-8');
    const peerPageNumbers = analyzingLogic(htmlChunk.toString());
    peerPageNumbers.forEach(function(item){
        ws.write(item.toString() + '\n\r');
    });    
    ws.end();
});

