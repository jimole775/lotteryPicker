const tools = require('./tools.js');
const fs = require('fs');
const path = require('path');
let writeDistance = 10;
let runStartTime = new Date().getTime();
module.exports = function(fileName,data,callback){

        if(isWaitingEnd()){

            const originPath = path.resolve(__dirname,`../../db/${fileName}.log`);
          
            fs.appendFileSync(originPath,data,'utf8');   
                
            tools.isFunction(callback)?callback():null;
        }

    }     
function isWaitingEnd(){
    const nowTime = new Date().getTime();
    if(nowTime - runStartTime >= writeDistance * 1000){
        runStartTime = nowTime;
        return true;
    }else{
        return false;
    }

}


