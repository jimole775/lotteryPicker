
const fs = require('fs');
const path = require('path');
// 10000000组 tenMillion.json
// 1000000组 oneMillion.json
// 100000组 hundredThousand.json
// 10000组 tenThousand.json
// 1000组 oneThousand.json
// 100组 hundred.json
// 10组 ten.json
// 1组 theOne.json


let tenMillionBatch = 5000000;
let oneMillionBatch = 1000000;
let hundredThousandBatch = 100000;
let tenThousandBatch = 10000;
let oneThousandBatch = 1000;
let hundredBatch = 100;
let tenBatch = 10;
let theOneBatch = 1;       

fs.readFile(path.resolve(__dirname,'../../db/front_rate_foundation.json'),function(err,frontData){
    fs.readFile(path.resolve(__dirname,'../../db/behind_rate_foundation.json'),function(err,behindData){     
        const frontRateFoun = JSON.parse(frontData.toString());
        const behindRateFoun = JSON.parse(behindData.toString());
        // building('tenMillionBatch',10);
        matchRightBatch([5,11,16,28,35],[6,9]);
        function building(type,times){
            let i = times;
            const ws = fs.createWriteStream(path.resolve(__dirname,'../../db/',type + '.txt'),'utf8');
            while(i--){
                ws.write(createABatch().toString() + '\r\n');
            }
            ws.end();
        }

        function matchRightBatch(fronts,behinds){
            let keepFetch = true;
            let rollTimes = 0;
            while(keepFetch){
                rollTimes++;
                let frontMatchedTimes = 0;
                let behindMatchedTimes = 0;
                let batch = createABatch();                    
                batch.forEach(function(item,index){
                    if(index < 5 && fronts.includes(item)){
                        frontMatchedTimes ++;
                    }else if(behinds.includes(item)){
                        behindMatchedTimes ++;
                    }
                });
                if(frontMatchedTimes === 5 && behindMatchedTimes === 2){
                    keepFetch = false;
                    console.log('摇奖完成，摇了'+rollTimes+'次，终于中得一等奖',batch.toString());
                } 
                if(frontMatchedTimes === 5 && behindMatchedTimes === 1){   
                    console.log('摇奖完成，摇了'+rollTimes+'次，终于中得二等奖',batch.toString());
                } 
                if(frontMatchedTimes === 5 && behindMatchedTimes === 0
                    || frontMatchedTimes === 4 && behindMatchedTimes === 2){   
                    console.log('摇奖完成，摇了'+rollTimes+'次，终于中得三等奖',batch.toString());
                } 
            }
        }

        function createABatch(){
            let fronts = [];
            let behinds = [];
            let newItem;
            while(fronts.length < 5){
                newItem = pickOne('front'); 
                if(!fronts.includes(newItem)){
                    fronts.push(newItem);  
                }
            }   
                        
            while(behinds.length < 2){
                newItem = pickOne('behind'); 
                if(!behinds.includes(newItem)){
                    behinds.push(newItem);  
                }
            }   
            fronts = fronts.sort(function(a,b){return a-b});
            behinds = behinds.sort(function(a,b){return a-b});
            return fronts.concat(behinds);
        }
        

        function pickOne(type){
            let result = '';
            if(type==='front'){
                result = frontRateFoun[suffixPick(10000) - 1]
            }
            if(type==='behind'){
                result = behindRateFoun[suffixPick(10000) - 1]
            }
            return parseInt(result);
        }
        
        function suffixPick(limit){
            return Math.ceil(Math.random()*limit);
        }


    });
});

