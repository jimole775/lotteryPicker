
const saveData = require('./app/saveData.js');
const RequestHtml = require('./app/requestHtml.js');
const analyzingHtml = require('./app/analyzingHtml.js');

const pageSize = 89;

async function batchFetch(){
    for(let i = 1;i<=pageSize;i++){
        console.log('循环次数：',i);
        let dirStr = '/historykj';
        let pathStr = '/history_' + i + '.jspx';
        let queryStr = '?_ltype=dlt';
        await fetching(dirStr + pathStr + queryStr);
    }
}

batchFetch();

function fetching(path){
    return new Promise(function(resolve){
        const req = new RequestHtml();

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
        
        req.fetch(options,function(htmlChunk){              
            saveData(analyzingHtml(htmlChunk.toString()), pageSize);
            setTimeout(function(){
                resolve();
            },1000);
        });
    });    
}



