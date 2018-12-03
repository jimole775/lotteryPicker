const tools = require('./tools.js');
const fs = require('fs');
const path = require('path');

module.exports = class IntervalWriter{

        constructor(fileName){
            this.cacheBuffer = [];
            this.fileName = fileName;
            this.writeDistance = 10;   
            this.runStartTime = new Date().getTime();
        }

        write(data,callback){
            
            if(this.isWaitingEnd()){
   
                console.log(`writed：${this.fileName} at `,tools.dateFormat('mm:ss')); 

                const originPath = path.resolve(__dirname,`../../db/${this.fileName}`);
              
                fs.appendFileSync(originPath,this.cacheBuffer.toString(),'utf8');   
                    
                this.cacheBuffer.length = 0;
                
                tools.isFunction(callback)?callback():null;
                
            }else{
                this.cacheBuffer.push(Buffer.from(data));
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


