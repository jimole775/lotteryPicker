const tools = require('./tools.js');
const fs = require('fs');
const path = require('path');

module.exports = class IntervalWriter{

        constructor(fileName){
            this.fileName = fileName;
            this.writeDistance = 10;   
            this.runStartTime = new Date().getTime();
        }

        write(data,callback){
            if(this.isWaitingEnd()){
   
                console.log(`writed：${this.fileName} at `,tools.dateFormat('mm:ss')); 

                const originPath = path.resolve(__dirname,`../../db/${this.fileName}`);
              
                fs.appendFileSync(originPath,data,'utf8');   
                    
                tools.isFunction(callback)?callback():null;
                
            }
        }
        isWaitingEnd(){
            const nowTime = new Date().getTime();
            if(nowTime - this.runStartTime >= this.writeDistance * 1000){
                this.runStartTime = nowTime;
                return true;
            }else{
                return false;
            }
        
        }
    }     


