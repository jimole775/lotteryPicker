const tools = require('./tools.js');
const fs = require('fs');
const path = require('path');

module.exports = class IntervalWriter{

        constructor(fileName){
            this.cacheBuffer = [];
            this.fileName = fileName;
            this.writeDistance = 5;   
            this.runStartTime = new Date().getTime();
        }

        write(data,callback){

            this.cacheBuffer.push(data);

            if(this.isWaitingEnd()){

                // console.log(`writed：${this.cacheBuffer}`); 
                
                const originPath = path.resolve(__dirname,`../../db/award/${this.fileName}`);
              
                fs.appendFileSync(originPath, this.cacheBuffer.join('\n').toString() + '\n','utf8');
                
                this.cacheBuffer.length = 0;
                
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


