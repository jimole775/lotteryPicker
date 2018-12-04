
const fs = require('fs');
const path = require('path');
const verifySeriesNum = require('./verifyNumSeries.js');
const IntervalWriter = require('../utils/IntervalWriter.js');
const tools = require('../utils/tools.js');
// 10000000组 tenMillion.json
// 1000000组 oneMillion.json
// 100000组 hundredThousand.json
// 10000组 tenThousand.json
// 1000组 oneThousand.json
// 100组 hundred.json
// 10组 ten.json
// 1组 theOne.json


let aBillion = 1000000000;
let tenMillionBatch = 10000000;
let oneMillionBatch = 1000000;
let hundredThousandBatch = 100000;
let tenThousandBatch = 10000;
let oneThousandBatch = 1000;
let hundredBatch = 100;
let tenBatch = 10;
let theOneBatch = 1;       


// 01,23,24,28,33,#04,#05
const awardTarget_front = [01,23,24,28,33];
const awardTarget_behind = [04,05];
const no1Writer = new IntervalWriter(`awardState.no1-${awardTarget_front.join('.')}#${awardTarget_behind.join('.')}.log`);
const no2Writer = new IntervalWriter(`awardState.no2-${awardTarget_front.join('.')}#${awardTarget_behind.join('.')}.log`);
const no3Writer = new IntervalWriter(`awardState.no3-${awardTarget_front.join('.')}#${awardTarget_behind.join('.')}.log`);
// const no4Writer = new IntervalWriter('awardState.no4.log');

fs.readFile(path.resolve(__dirname,'../../db/front_rate_foundation.json'),function(err,frontData){
    fs.readFile(path.resolve(__dirname,'../../db/behind_rate_foundation.json'),function(err,behindData){     
        const frontRateFoun = JSON.parse(frontData.toString());
        const behindRateFoun = JSON.parse(behindData.toString());
        // building('tenMillionBatch',10);
        // 07,10,22,23,33,#08,#11
        matchRightBatch(awardTarget_front,awardTarget_behind);
        function building(type,times){
            let i = times;
            const ws = fs.createWriteStream(path.resolve(__dirname,'../../db/',type + '.log'),'utf8');
            while(i--){
                ws.write(createABatch().toString() + '\r\n');
            }
            ws.end();
        }

        function matchRightBatch(fronts,behinds){
            let awardState = {
                no1:0,
                no2:0,
                no3:0,
                no4:0,
                rollTimeSum:'',
                rollTimeCalc:0
            };
            while(aBillion--){
                awardState.rollTimeCalc ++;
                if(awardState.rollTimeCalc >= 10000000){
                    awardState.rollTimeSum += 'i'; 
                    if(awardState.rollTimeSum.length > 10){
                        awardState.rollTimeSum = awardState.rollTimeSum.replace(/i{10}/g,'v');
                        awardState.rollTimeSum = awardState.rollTimeSum.replace(/v{10}/g,'W');
                    }
                    awardState.rollTimeCalc = 0;
                }
                let frontMatchedTimes = 0;
                let behindMatchedTimes = 0;
                let batch = createABatch();   
                var seriesItem = verifySeriesNum(batch);
                // 如果有连号超过3次，就废弃这个摇号
                if(seriesItem.length > 2){
                    aBillion ++;
                    continue;
                }
                batch.forEach(function(item,index){
                    if(index < 5 && fronts.includes(item)){
                        frontMatchedTimes ++;
                    }else if(behinds.includes(item)){
                        behindMatchedTimes ++;
                    }
                });

                awardState.no1++;
                awardState.no2++;
                awardState.no3++;
                // awardState.no4.peerAwardInRollTimes++;
                if(frontMatchedTimes === 5 && behindMatchedTimes === 2){  
                    afterAwarded(awardState.no1,1,awardState.rollTimeSum,awardState.rollTimeCalc);
                    awardState.no1 = 0;
                } 
                if(frontMatchedTimes === 5 && behindMatchedTimes === 1){   
                    afterAwarded(awardState.no2,2,awardState.rollTimeSum,awardState.rollTimeCalc);  
                    awardState.no2 = 0;
                } 
                if(frontMatchedTimes === 5 && behindMatchedTimes === 0
                    || frontMatchedTimes === 4 && behindMatchedTimes === 2){   
                        afterAwarded(awardState.no3,3,awardState.rollTimeSum,awardState.rollTimeCalc); 
                        awardState.no3 = 0; 
                } 
                if(frontMatchedTimes === 4 && behindMatchedTimes === 1
                    || frontMatchedTimes === 3 && behindMatchedTimes === 2){ 
                        // afterAwarded(awardState.no4,4,awardState.rollTimeSum);    
                } 

            }
        }

        
        function afterAwarded(peerAwardInRollTimes,awardLevel,rollTimeSum,rollTimeCalc){
 
            const writeData = `rollTimeSum:${rollTimeSum + rollTimeCalc} awardDistance:${peerAwardInRollTimes.toString()}`; 
            const writerMap = {
                1:no1Writer,
                2:no2Writer,
                3:no3Writer,
                // 4:no4Writer
            }
            writerMap[awardLevel].write(writeData)
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

