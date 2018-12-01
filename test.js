
const fs = require('fs');
const path = require('path');
let writeDistance = 10;
let runStartTime = new Date().getTime();
module.exports = function write(fileName,data,callback){
  
    if(isWaitingEnd()){
        fs.appendFile(path.resolve(__dirname,`./db/${fileName}.log`), JSON.stringify(data),'utf8',function(err){
            console.log('写了一次');
            if(err)console.log(err);
        });
    }

   
    
    function isWaitingEnd(){
        const nowTime = new Date().getTime();
        if(nowTime - runStartTime >= writeDistance * 1000){
            return runStartTime = nowTime;
        }
    }

}
