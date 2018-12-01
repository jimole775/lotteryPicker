const tools = require('./tools.js');
const fs = require('fs');
const path = require('path');
let writeDistance = 10;
let runStartTime = new Date().getTime();
module.exports = class Writer{
    constructor(fileName,data,callback){

        if(this.isWaitingEnd()){
            try{
            const originPath = path.resolve(__dirname,`../../db/${fileName}.log`);
          
            fs.appendFileSync(originPath,JSON.stringify(data),'utf8',function(err){
                console.log('写了一次');
                if(err)console.log(err);
            });   
                
    
        }catch(err){console.log(err);}
        }

    }     

    isWaitingEnd(){
        const nowTime = new Date().getTime();
        if(nowTime - runStartTime >= writeDistance * 1000){
            return runStartTime = nowTime;
        }
    }
}
