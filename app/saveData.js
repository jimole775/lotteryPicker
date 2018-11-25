const fs = require('fs');
const path = require('path');
let pageIndex = 1;
const ws = fs.createWriteStream(path.resolve('./','db/result.txt'), 'utf-8');
function writeData(peerPageData,pageSize){
    peerPageData.forEach(function(item){
        ws.write(item.toString() + '\n');
    });         
    console.log('页数下标：',pageIndex);
    if(pageIndex ++ >= pageSize){
        console.log('获取完毕');
        ws.end();
    }  
}

module.exports = writeData;